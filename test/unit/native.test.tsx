// @ts-ignore
(typeof global === 'undefined' ? window : global).IS_REACT_ACT_ENVIRONMENT = true;
import assert from 'assert';
import React from 'react';
import { Fragment } from 'react';
import { create } from 'react-test-renderer';

import { TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { EventProvider, useEvent } from 'react-native-event';

type EventTypes = MouseEvent | TouchEvent | KeyboardEvent;

describe('react-native', () => {
  it('click', async () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onPress, onEvent }) {
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

    let pressValue: React.MouseEvent<HTMLButtonElement>;
    let eventValue: EventTypes;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onPress = (x) => (pressValue = x);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    const onEvent = (x) => (eventValue = x);
    const { root } = await React.act(() => create(<Component onPress={onPress} onEvent={onEvent} />));
    assert.equal(pressValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    pressValue = undefined;
    eventValue = undefined;
    React.act(() => {
      const event = {
        target: root.findByProps({ testID: 'inside' }),
        persist() {
          /* empty */
        },
      };
      root.findByProps({ testID: 'inside' }).props.onPress(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props?.onStartShouldSetResponderCapture) node.props.onStartShouldSetResponderCapture(event);
      });
    });
    assert.equal(pressValue.target, root.findByProps({ testID: 'inside' }));
    assert.ok(!!eventValue);

    // outside
    pressValue = undefined;
    eventValue = undefined;
    React.act(() => {
      const event = {
        target: root.findByProps({ testID: 'outside' }),
        persist() {
          /* empty */
        },
      };
      root.findByProps({ testID: 'outside' }).props.onPress(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props?.onStartShouldSetResponderCapture) node.props.onStartShouldSetResponderCapture(event);
      });
    });
    assert.equal(pressValue.target, root.findByProps({ testID: 'outside' }));
    assert.ok(!!eventValue);
  });

  it('press missing provider', async () => {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <Fragment />;
    }

    function Component({ onPress, onEvent }) {
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
      const onEvent = () => {
        /* emptty */
      };
      await React.act(() => create(<Component onPress={onPress} onEvent={onEvent} />));
    } catch (err) {
      console.log(err);
      assert.ok(err.message.indexOf('subscribe not found on context') >= 0);
    }
  });
});
