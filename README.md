## react-native-event

React context for subscribing to all react native or DOM user interaction events in react universal (react-dom, react-native, react-native-web) applications.

### Example 1 - Native

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

### Example 2 - DOM

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEvent, EventProvider } from 'react-native-event';

function UseEventComponent() {
  const handler = React.useCallback((event) => {
    /* do something with any event */
  });

  useEvent(handler, [handler]);
  return <React.Fragment />;
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.Fragment>
    <EventProvider events={['click'] /* default */}>
      <UseEventComponent />
      <button id="demo-1" onClick={() => {}} />
    </EventProvider>
    <button id="demo-2" onClick={() => {}} />
  </React.Fragment>,
);

// any click will call the global event handler
document.getElementById('demo-1').click();
document.getElementById('demo-2').click();
```

### Documentation

[API Docs](https://kmalakoff.github.io/react-native-event/)
