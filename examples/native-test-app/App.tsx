import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type * as ReactNativeEvent from 'react-native-event';

const { EventProvider, useEvent } = require('react-native-event') as typeof ReactNativeEvent;

function Listener({ mode, onEvent }: { mode: string; onEvent: (mode: string) => void }) {
  const handler = useCallback(() => {
    onEvent(mode);
  }, [mode, onEvent]);
  useEvent(handler, [mode]);
  return null;
}

function App() {
  const [eventCount, setEventCount] = useState(0);
  const [insidePressCount, setInsidePressCount] = useState(0);
  const [outsideCount, setOutsideCount] = useState(0);
  const [mode, setMode] = useState('initial');
  const [lastEventMode, setLastEventMode] = useState('none');
  const [enabled, setEnabled] = useState(true);

  const onEvent = useCallback((eventMode: string) => {
    setEventCount((count) => count + 1);
    setLastEventMode(eventMode);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <TouchableOpacity testID="update-button" onPress={() => setMode('updated')} style={styles.button}>
          <Text>Update handler</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="toggle-button" onPress={() => setEnabled((value) => !value)} style={styles.button}>
          <Text>{enabled ? 'Disable handler' : 'Enable handler'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.interactionArea}>
        <EventProvider>
          <TouchableOpacity testID="inside-button" onPress={() => setInsidePressCount((count) => count + 1)} style={styles.button}>
            <Text>Inside</Text>
          </TouchableOpacity>
          {enabled ? <Listener mode={mode} onEvent={onEvent} /> : null}
        </EventProvider>
      </View>
      <TouchableOpacity testID="outside-button" onPress={() => setOutsideCount((count) => count + 1)} style={styles.button}>
        <Text>Outside</Text>
      </TouchableOpacity>
      <Text testID="event-count">EVENT_COUNT_{eventCount}</Text>
      <Text testID="inside-count">INSIDE_PRESS_COUNT_{insidePressCount}</Text>
      <Text testID="outside-count">OUTSIDE_COUNT_{outsideCount}</Text>
      <Text testID="event-mode">EVENT_MODE_{lastEventMode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  controls: {
    gap: 12,
  },
  interactionArea: {
    height: 100,
    gap: 12,
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#dddddd',
  },
});

export default App;
