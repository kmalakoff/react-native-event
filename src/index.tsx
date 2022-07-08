import React from 'react';
import ReactNative from 'react-native';

export type EventTypes = ReactNative.GestureResponderEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => void;
};

export const EventContext = React.createContext<EventContextType | undefined>(
  undefined,
);

export type EventProviderProps = {
  events?: string[];
  children?: React.ReactNode;
};
export function EventProvider({ children }: EventProviderProps) {
  const state = React.useState<HandlerType[]>([]);
  const handlers = state[0];

  function onEvent(event: EventTypes) {
    handlers.forEach((subscriber) => subscriber(event));
  }
  function subscribe(handler: HandlerType) {
    handlers.push(handler);
    return () => handlers.splice(handlers.indexOf(handler), 1);
  }

  return (
    <EventContext.Provider value={{ subscribe }}>
      <ReactNative.View
        style={ReactNative.StyleSheet.absoluteFill}
        onStartShouldSetResponderCapture={(
          event: ReactNative.GestureResponderEvent,
        ) => {
          event.persist();
          onEvent(event);
          return false;
        }}
      >
        {children}
      </ReactNative.View>
    </EventContext.Provider>
  );
}

export function useEvent(handler, dependencies) {
  const context = React.useContext(EventContext);
  if (!context) {
    throw new Error(
      'react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event',
    );
  }

  React.useEffect(
    () => context.subscribe(handler),
    [context.subscribe, handler].concat(dependencies),
  );
}
