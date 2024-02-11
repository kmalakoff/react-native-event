import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
export const EventContext = createContext(undefined);
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
    return createElement(EventContext.Provider, {
        value: {
            subscribe
        }
    }, createElement(View, {
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
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(()=>context.subscribe(handler), [
        context.subscribe,
        handler
    ].concat(dependencies));
}
