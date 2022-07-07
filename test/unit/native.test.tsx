import assert from 'assert';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { View, TouchableOpacity } from 'react-native';
import { useEvent, EventProvider } from 'react-native-event';
import visit from '../lib/visit';

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
    const onPress = (x) => {
      pressValue = x;

      // emulate onStartShouldSetResponderCapture
      visit(toJSON(), (element) => {
        if (element.props.onStartShouldSetResponderCapture)
          element.props.onStartShouldSetResponderCapture(
            Object.assign({
              persist: function () {
                /* empty */
              },
              x,
            }),
          );
      });
    };
    let eventValue;
    const onEvent = (x) => (eventValue = x);
    const { getByTestId, toJSON } = await render(
      <Component onPress={onPress} onEvent={onEvent} />,
    );
    assert.equal(pressValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    pressValue = undefined;
    eventValue = undefined;
    fireEvent.press(getByTestId('inside'), { target: getByTestId('inside') });
    assert.equal(pressValue.target, getByTestId('inside'));
    assert.ok(!!eventValue);

    // outside
    pressValue = undefined;
    eventValue = undefined;
    fireEvent.press(getByTestId('outside'), { target: getByTestId('outside') });
    assert.equal(pressValue.target, getByTestId('outside'));
    assert.ok(!!eventValue);
  });
});
