// SKIP: esm import not support by react-native

import assert from 'assert';
import { EventContext, useEvent, EventProvider } from 'react-native-event';

describe('exports .ts', function () {
  it('defaults', function () {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});
