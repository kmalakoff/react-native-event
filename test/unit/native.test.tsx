import assert from 'assert';
import React from 'react';
import { create, act } from 'react-test-renderer';

import { View, TouchableOpacity } from 'react-native';
import { useEvent, EventProvider } from 'react-native-event';

describe('react-native', function () {
  it('click', async function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
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

    let pressValue;
    const onPress = (event) => (pressValue = event);
    let eventValue;
    const onEvent = (x) => (eventValue = x);

    const { root } = await act(() =>
      create(<Component onPress={onPress} onEvent={onEvent} />),
    );
    assert.equal(pressValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    pressValue = undefined;
    eventValue = undefined;
    act(() => {
      const event = {
        target: root.findByProps({ testID: 'inside' }),
        persist() {
          /* empty */
        },
      };
      root.findByProps({ testID: 'inside' }).props.onPress(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props && node.props.onStartShouldSetResponderCapture)
          node.props.onStartShouldSetResponderCapture(event);
      });
    });
    assert.equal(pressValue.target, root.findByProps({ testID: 'inside' }));
    assert.ok(!!eventValue);

    // outside
    pressValue = undefined;
    eventValue = undefined;
    act(() => {
      const event = {
        target: root.findByProps({ testID: 'outside' }),
        persist() {
          /* empty */
        },
      };
      root.findByProps({ testID: 'outside' }).props.onPress(event);
      // emulate onStartShouldSetResponderCapture
      root.findAll((node) => {
        if (node.props && node.props.onStartShouldSetResponderCapture)
          node.props.onStartShouldSetResponderCapture(event);
      });
    });
    assert.equal(pressValue.target, root.findByProps({ testID: 'outside' }));
    assert.ok(!!eventValue);
  });

  it('press missing provider', async function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
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
      await act(() =>
        create(<Component onPress={onPress} onEvent={onEvent} />),
      );
    } catch (err) {
      console.log(err);
      assert.ok(err.message.indexOf('subscribe not found on context') >= 0);
    }
  });
});
