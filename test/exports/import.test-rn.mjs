import assert from 'assert';
import { EventContext, EventProvider, useEvent } from 'react-native-event';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
