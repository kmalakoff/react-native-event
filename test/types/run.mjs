import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeRmSync } from 'fs-remove-compat';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureSource = path.dirname(fileURLToPath(import.meta.url));
const packageName = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).name;
mkdirSync(path.join(repoRoot, '.tmp'), { recursive: true });
const fixtureRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-fixture-'));
const regressionRoot = mkdtempSync(path.join(repoRoot, '.tmp/type-regression-'));
const tsdsEntry = path.join(repoRoot, 'node_modules', 'ts-dev-stack', 'bin', 'cli.js');

function prepareFixture(root, source) {
  cpSync(path.join(fixtureSource, 'package.json'), path.join(root, 'package.json'));
  cpSync(path.join(fixtureSource, 'tsconfig.json'), path.join(root, 'tsconfig.json'));
  cpSync(path.join(fixtureSource, 'src'), path.join(root, 'src'), { recursive: true });
  if (source) writeFileSync(path.join(root, 'src/index.ts'), source);
  const nodeModules = path.join(root, 'node_modules');
  mkdirSync(nodeModules);
  symlinkSync(repoRoot, path.join(nodeModules, packageName), process.platform === 'win32' ? 'junction' : 'dir');
  symlinkSync(path.join(repoRoot, 'node_modules', 'react'), path.join(nodeModules, 'react'), process.platform === 'win32' ? 'junction' : 'dir');
  symlinkSync(path.join(repoRoot, 'node_modules', 'react-native'), path.join(nodeModules, 'react-native'), process.platform === 'win32' ? 'junction' : 'dir');
}

function buildFixture(root, stdio = 'inherit') {
  execFileSync(process.execPath, [tsdsEntry, 'build'], { cwd: root, stdio });
}

try {
  if (!existsSync(tsdsEntry)) throw new Error(`Missing repository tsds entry: ${tsdsEntry}`);
  const source = readFileSync(path.join(fixtureSource, 'src/index.ts'), 'utf8');
  prepareFixture(fixtureRoot);
  buildFixture(fixtureRoot);
  if (!existsSync(path.join(fixtureRoot, 'dist', 'cjs', 'index.js'))) throw new Error('Type fixture did not build its public-name import');

  const invalidProps = "const invalidProps: EventProviderProps = { events: ['press'] };";
  const validProps = 'const invalidProps: EventProviderProps = { children: null };';
  const regressionSource = source.replace(invalidProps, validProps);
  if (regressionSource === source) throw new Error('Type fixture regression probe could not find its negative case');
  prepareFixture(regressionRoot, regressionSource);
  let diagnostics = '';
  try {
    buildFixture(regressionRoot, 'pipe');
  } catch (error) {
    diagnostics = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  }
  if (!diagnostics.includes('TS2578')) throw new Error('Type fixture regression probe did not report an unused @ts-expect-error directive');
} finally {
  safeRmSync(fixtureRoot, { recursive: true, force: true });
  safeRmSync(regressionRoot, { recursive: true, force: true });
}
