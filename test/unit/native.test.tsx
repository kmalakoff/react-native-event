((typeof global === 'undefined' ? window : global) as unknown as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

import assert from 'assert';
import React, { Fragment } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { EventProvider, type EventTypes, type HandlerType, useEvent } from 'react-native-event';
import { create } from 'react-test-renderer';

describe('react-native', () => {
  it('click', async () => {
    function UseEventComponent({ onEvent }: { onEvent: HandlerType }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onPress, onEvent }: { onPress: (event: unknown) => void; onEvent: HandlerType }) {
      return (
        <View>
          <EventProvider>
            <TouchableOpacity testID="inside" onPress={onPress} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <TouchableOpacity testID="outside" onPress={onPress} />
        </View>
      );
    }

    let pressValue: unknown;
    let eventValue: EventTypes | undefined;
    const onPress = (x: unknown) => {
      pressValue = x;
    };
    const onEvent: HandlerType = (x) => {
      eventValue = x;
    };
    const { root } = await React.act(() => create(<Component onPress={onPress} onEvent={onEvent} />));
    assert.equal(pressValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    pressValue = undefined;
    eventValue = undefined as EventTypes | undefined;
    React.act(() => {
      const event = {
        target: root.findByProps({ testID: 'inside' }),
        persist() {
          /* empty */
        },
      };
      (root.findByProps({ testID: 'inside' }).props.onPress as (e: unknown) => void)(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props?.onStartShouldSetResponderCapture) (node.props.onStartShouldSetResponderCapture as (e: unknown) => void)(event);
        return false;
      });
    });
    assert.equal((pressValue as Record<string, unknown>)?.target, root.findByProps({ testID: 'inside' }));
    assert.ok(!!eventValue);

    // outside
    pressValue = undefined;
    eventValue = undefined as EventTypes | undefined;
    React.act(() => {
      const event = {
        target: root.findByProps({ testID: 'outside' }),
        persist() {
          /* empty */
        },
      };
      (root.findByProps({ testID: 'outside' }).props.onPress as (e: unknown) => void)(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props?.onStartShouldSetResponderCapture) (node.props.onStartShouldSetResponderCapture as (e: unknown) => void)(event);
        return false;
      });
    });
    assert.equal((pressValue as Record<string, unknown>)?.target, root.findByProps({ testID: 'outside' }));
    assert.ok(!!eventValue);
  });

  it('press missing provider', async () => {
    function UseEventComponent({ onEvent }: { onEvent: HandlerType }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onPress, onEvent }: { onPress: () => void; onEvent: HandlerType }) {
      return (
        <View>
          <TouchableOpacity testID="inside" onPress={onPress} />
          <UseEventComponent onEvent={onEvent} />
          <TouchableOpacity testID="outside" onPress={onPress} />
        </View>
      );
    }

    try {
      const onPress = () => {
        /* emptty */
      };
      const onEvent: HandlerType = () => {
        /* emptty */
      };
      await React.act(() => create(<Component onPress={onPress} onEvent={onEvent} />));
    } catch (err: unknown) {
      console.log(err);
      assert.ok((err as Error).message.indexOf('subscribe not found on context') >= 0);
    }
  });
});
