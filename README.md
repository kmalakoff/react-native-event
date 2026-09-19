# react-native-event

React context for subscribing to React Native interaction events within a view subtree.

```sh
npm install react-native-event
```

The package requires React 16.8 or newer, React Native, and Node.js 16 or newer.

For a react-dom version, check out [react-dom-event](https://www.npmjs.com/package/react-dom-event)

### Example 1

```tsx
import { useCallback, Fragment } from "react";
import { TouchableOpacity } from "react-native";
import { useEvent, EventProvider, type EventTypes } from "react-native-event";

function UseEventComponent() {
  const handler = useCallback((event: EventTypes) => {
    /* do something with any event */
  }, []);

  useEvent(handler, [handler]);
  return <Fragment />;
}

const App = () => {
  return (
    <EventProvider>
      <Fragment>
        <UseEventComponent />
        <TouchableOpacity onPress={() => {}} />
      </Fragment>
    </EventProvider>
  );
};
export default App;

// Presses within EventProvider reach the subscribed handler.
```

Place `EventProvider` around the complete interaction area, including any portal
host whose presses should be observed. Input outside that subtree is not captured.
The provider observes responder capture and leaves child press handling intact.
It does not accept an `events` configuration prop.

### Testing

Run `npm test` for strict consumer types, browser interactions, and registry tests.
Run `npm run test:engines` for export resolution on Node.js 16.0.0; it does not
execute React Native. GitHub Actions tests real iOS and Android input through
the shared native fixture. See the [compatibility matrix](test/README.md).

### Documentation

[API Docs](https://kmalakoff.github.io/react-native-event/)
