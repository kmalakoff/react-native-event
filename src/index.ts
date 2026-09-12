import { useState, useEffect, useContext, createContext, createElement } from 'react';
import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

export type EventTypes = GestureResponderEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => void;
};

export const EventContext = createContext<EventContextType | undefined>(undefined);

export type EventProviderProps = {
  events?: string[];
  children?: ReactNode;
};
export function EventProvider({ children }: EventProviderProps) {
  const state = useState<HandlerType[]>([]);
  const handlers = state[0];

  function onEvent(event: EventTypes) {
    handlers.forEach((subscriber) => subscriber(event));
  }
  function subscribe(handler: HandlerType) {
    handlers.push(handler);
    return () => handlers.splice(handlers.indexOf(handler), 1);
  }

  return createElement(
    EventContext.Provider,
    { value: { subscribe } },
    createElement(
      View,
      {
        style: StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture: (event) => {
          event.persist();
          onEvent(event);
          return false;
        },
      },
      children,
    ),
  );
}

export function useEvent(handler, dependencies) {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event');
  }

  useEffect(() => context.subscribe(handler), [context.subscribe, handler].concat(dependencies));
}
