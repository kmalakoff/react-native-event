import assert from 'assert';

import { createSubscriptionRegistry } from '../../../src/lib/subscription-registry.ts';

describe('subscription registry', () => {
  it('dispatches a snapshot when handlers remove subscriptions', () => {
    const registry = createSubscriptionRegistry<null>();
    const received: string[] = [];
    let firstCleanup: () => void = () => undefined;
    let secondCleanup: () => void = () => undefined;
    firstCleanup = registry.subscribe(() => {
      received.push('first');
      firstCleanup();
    });
    secondCleanup = registry.subscribe(() => {
      received.push('second');
      secondCleanup();
    });

    registry.dispatch(null);
    assert.deepEqual(received, ['first', 'second']);
    received.length = 0;
    registry.dispatch(null);
    assert.deepEqual(received, []);
  });

  it('defers subscriptions added during dispatch', () => {
    const registry = createSubscriptionRegistry<null>();
    const received: string[] = [];
    let added = false;
    registry.subscribe(() => {
      received.push('first');
      if (!added) {
        added = true;
        registry.subscribe(() => received.push('added'));
      }
    });
    registry.subscribe(() => received.push('second'));

    registry.dispatch(null);
    assert.deepEqual(received, ['first', 'second']);
    received.length = 0;
    registry.dispatch(null);
    assert.deepEqual(received, ['first', 'second', 'added']);
  });

  it('cleans duplicate registrations independently and idempotently', () => {
    const registry = createSubscriptionRegistry<null>();
    const received: string[] = [];
    const duplicate = () => received.push('duplicate');
    const firstCleanup = registry.subscribe(duplicate);
    registry.subscribe(() => received.push('marker'));
    const thirdCleanup = registry.subscribe(duplicate);

    thirdCleanup();
    thirdCleanup();
    registry.dispatch(null);
    assert.deepEqual(received, ['duplicate', 'marker']);
    received.length = 0;
    firstCleanup();
    registry.dispatch(null);
    assert.deepEqual(received, ['marker']);
  });
});
