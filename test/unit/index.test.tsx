import assert from 'assert';
import React, { Fragment, useCallback } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { EventProvider, type EventTypes, useEvent } from 'react-native-event';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('React Native Web capture', () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    React.act(() => root.unmount());
    host.remove();
  });
  function press(id: string) {
    const button = host.querySelector<HTMLButtonElement>(`#${id}`);
    assert.ok(button);
    React.act(() => {
      button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
      button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 }));
      button.click();
    });
  }

  it('captures descendant input, preserves child clicks, updates handlers, and cleans up', () => {
    const received: string[] = [];
    const targets: unknown[] = [];
    let childClicks = 0;
    function Listener({ mode }: { mode: string }) {
      const handler = useCallback(
        (event: EventTypes) => {
          received.push(mode);
          targets.push(event.target);
        },
        [mode]
      );
      useEvent(handler, [mode]);
      return null;
    }
    function App({ mode, mounted = true }: { mode: string; mounted?: boolean }) {
      return (
        <Fragment>
          <div style={{ position: 'relative', height: 100 }}>
            <EventProvider>
              {mounted && <Listener mode={mode} />}
              <button
                type="button"
                id="inside"
                onClick={(event) => {
                  event.stopPropagation();
                  childClicks++;
                }}
              >
                Inside
              </button>
            </EventProvider>
          </div>
          <button type="button" id="outside">
            Outside
          </button>
        </Fragment>
      );
    }
    React.act(() => root.render(<App mode="first" />));
    press('inside');
    press('outside');
    assert.deepEqual(received, ['first']);
    assert.equal(childClicks, 1);
    assert.strictEqual(targets[0], host.querySelector('#inside'));
    React.act(() => root.render(<App mode="second" />));
    press('inside');
    assert.deepEqual(received, ['first', 'second']);
    React.act(() => root.render(<App mode="second" mounted={false} />));
    press('inside');
    assert.deepEqual(received, ['first', 'second']);
    assert.equal(childClicks, 3);
  });

  it('throws when useEvent has no provider', () => {
    function MissingProvider() {
      useEvent(() => undefined, []);
      return null;
    }
    assert.throws(() => React.act(() => root.render(<MissingProvider />)), /subscribe not found on context/);
  });
});
