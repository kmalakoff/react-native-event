import assert from 'assert';
// @ts-ignore
import { EventContext, EventProvider, useEvent } from 'react-native-event';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
