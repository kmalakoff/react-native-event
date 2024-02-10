import { useState, useEffect, useContext, createContext, createElement } from 'react';
import { View, StyleSheet } from 'react-native';
export const EventContext = /*#__PURE__*/ createContext(undefined);
export function EventProvider({ children  }) {
    const state = useState([]);
    const handlers = state[0];
    function onEvent(event) {
        handlers.forEach((subscriber)=>subscriber(event));
    }
    function subscribe(handler) {
        handlers.push(handler);
        return ()=>handlers.splice(handlers.indexOf(handler), 1);
    }
    //   <EventContext.Provider value={{ subscribe }}>
    //   <View
    //     style={StyleSheet.absoluteFill}
    //     onStartShouldSetResponderCapture={(
    //       event: GestureResponderEvent,
    //     ) => {
    //       event.persist();
    //       onEvent(event);
    //       return false;
    //     }}
    //   >
    //     {children}
    //   </View>
    // </EventContext.Provider>
    return /*#__PURE__*/ createElement(EventContext.Provider, {
        value: {
            subscribe
        }
    }, /*#__PURE__*/ createElement(View, {
        style: StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture: (event)=>{
            event.persist();
            onEvent(event);
            return false;
        }
    }, children));
}
export function useEvent(handler, dependencies) {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event');
    }
    useEffect(()=>context.subscribe(handler), [
        context.subscribe,
        handler
    ].concat(dependencies));
}
