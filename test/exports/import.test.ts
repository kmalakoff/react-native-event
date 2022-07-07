import assert from 'assert';
import { EventContext, useEvent, EventProvider } from 'react-native-event';

describe('exports .mjs', function () {
  it('defaults', function () {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
