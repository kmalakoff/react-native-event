const assert = require('assert');
const { execFileSync } = require('child_process');
const path = require('path');

describe('exports .cjs', () => {
  it('resolves the CommonJS entry', () => {
    const packageJsonPath = require.resolve('react-native-event/package.json');
    const packageJson = require(packageJsonPath);
    assert.equal(require.resolve('react-native-event'), path.resolve(path.dirname(packageJsonPath), packageJson.main));
  });
  it('resolves one native entry for both import styles', () => {
    const root = path.dirname(require.resolve('react-native-event/package.json'));
    const resolved = execFileSync(process.execPath, ['--conditions=react-native', '-p', "require.resolve('react-native-event')"], { cwd: root, encoding: 'utf8' }).trim();
    assert.equal(resolved, path.join(root, 'dist/esm/index.js'));
  });
});
