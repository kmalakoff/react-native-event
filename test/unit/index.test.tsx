import assert from 'assert';
import React, { Component, Fragment, type ReactNode, useCallback } from 'react';
import { EventProvider, type EventTypes, useEvent } from 'react-native-event';
import { act, type MountedRoot, mount } from '../lib/react-dom.tsx';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('React Native Web capture', () => {
  let host: HTMLDivElement;
  let root: MountedRoot;
  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    act(() => {
      root = mount(host, null);
    });
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });
  function press(id: string) {
    const button = host.querySelector<HTMLButtonElement>(`#${id}`);
    assert.ok(button);
    act(() => {
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
              />
            </EventProvider>
          </div>
          <button type="button" id="outside" />
        </Fragment>
      );
    }
    act(() => root.render(<App mode="first" />));
    press('inside');
    press('outside');
    assert.deepEqual(received, ['first']);
    assert.equal(childClicks, 1);
    assert.strictEqual(targets[0], host.querySelector('#inside'));
    act(() => root.render(<App mode="second" />));
    press('inside');
    assert.deepEqual(received, ['first', 'second']);
    act(() => root.render(<App mode="second" mounted={false} />));
    press('inside');
    assert.deepEqual(received, ['first', 'second']);
    assert.equal(childClicks, 3);
  });

  it('throws when useEvent has no provider', () => {
    let capturedError: unknown;
    class Boundary extends Component<{ children?: ReactNode }, { failed: boolean }> {
      state = { failed: false };
      static getDerivedStateFromError() {
        return { failed: true };
      }
      componentDidCatch(error: unknown) {
        capturedError = error;
      }
      render() {
        return this.state.failed ? null : this.props.children;
      }
    }
    function MissingProvider() {
      useEvent(() => undefined, []);
      return null;
    }

    // React reports a caught render error to window.onerror in development; keep it from failing the run
    const originalOnError = window.onerror;
    window.onerror = () => true;
    const originalConsoleError = console.error;
    console.error = () => undefined;
    try {
      act(() =>
        root.render(
          <Boundary>
            <MissingProvider />
          </Boundary>
        )
      );
    } finally {
      console.error = originalConsoleError;
      window.onerror = originalOnError;
    }
    assert.ok(capturedError instanceof Error);
    assert.ok(/subscribe not found on context/.test(capturedError.message));
  });
});
