## react-native-event

React context for subscribing to all react native interaction events.

For a react-dom version, check out [react-dom-event](https://www.npmjs.com/package/react-dom-event)

### Example 1

```jsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useEvent, EventProvider } from 'react-native-event';

function UseEventComponent() {
  const handler = React.useCallback((event) => {
    /* do something with any event */
  });

  useEvent(handler, [handler]);
  return <React.Fragment />;
}

const App = () => {
  return (
    <React.Fragment>
      <EventProvider>
        <UseEventComponent />
        <TouchableOpacity onPress={() => {}} />
      </EventProvider>
      <TouchableOpacity onPress={() => {}} />
    </React.Fragment>
  );
};
export default App;

// any press will call the global event handler
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-native-event/)
