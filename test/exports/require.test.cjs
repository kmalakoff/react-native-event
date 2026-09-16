const assert = require('assert');
const path = require('path');

describe('exports .cjs', () => {
  it('resolves the CommonJS entry', () => {
    const packageJsonPath = require.resolve('react-native-event/package.json');
    const packageJson = require(packageJsonPath);
    assert.equal(require.resolve('react-native-event'), path.resolve(path.dirname(packageJsonPath), packageJson.main));
  });
});
