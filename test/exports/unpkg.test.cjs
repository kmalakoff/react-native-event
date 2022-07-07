/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { EventContext, useEvent, EventProvider } = require('react-native-event');

describe('exports react-native-event/dist/umd/react-native-event.js', function () {
  it('defaults', function () {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
