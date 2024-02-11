const assert = require('assert');
const { EventContext, useEvent, EventProvider } = require('react-native-event');

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
