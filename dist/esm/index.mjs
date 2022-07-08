import React from 'react';
import ReactNative from 'react-native';
export const EventContext = /*#__PURE__*/ React.createContext(undefined);
export function EventProvider({ children  }) {
    const [handlers] = React.useState([]);
    function onEvent(event) {
        handlers.forEach((subscriber)=>subscriber(event));
    }
    function subscribe(handler) {
        handlers.push(handler);
        return ()=>handlers.splice(handlers.indexOf(handler), 1);
    }
    return /*#__PURE__*/ React.createElement(EventContext.Provider, {
        value: {
            subscribe
        }
    }, /*#__PURE__*/ React.createElement(ReactNative.View, {
        style: ReactNative.StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture: (event)=>{
            event.persist();
            onEvent(event);
            return false;
        }
    }, children));
}
export function useEvent(handler, dependencies) {
    const context = React.useContext(EventContext);
    if (!context.subscribe) throw new Error('react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event');
    React.useEffect(()=>context.subscribe(handler), [
        context.subscribe,
        handler
    ].concat(dependencies));
}
export default {
    EventContext,
    EventProvider,
    useEvent
};
