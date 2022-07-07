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
  const [handlers] = React.useState<HandlerType[]>([]);
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
  const { subscribe } = React.useContext(EventContext);
  React.useEffect(
    () => subscribe(handler),
    [subscribe, handler].concat(dependencies),
  );
}

export default {
  EventContext,
  EventProvider,
  useEvent,
};
