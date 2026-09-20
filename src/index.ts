import type { ReactNode } from 'react';
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { createSubscriptionRegistry } from './lib/subscription-registry.ts';

export type EventTypes = GestureResponderEvent;
export type HandlerType = (event: EventTypes) => void;

export type EventContextType = {
  subscribe: (handler: HandlerType) => () => void;
};

export const EventContext = createContext<EventContextType | undefined>(undefined);

export type EventProviderProps = {
  children?: ReactNode;
};
export function EventProvider({ children }: EventProviderProps) {
  const subscriptions = useRef(createSubscriptionRegistry<EventTypes>()).current;

  const onEvent = useCallback(
    (event: EventTypes) => {
      subscriptions.dispatch(event);
    },
    [subscriptions]
  );

  const subscribe = useCallback((handler: HandlerType) => subscriptions.subscribe(handler), [subscriptions]);

  const onStartShouldSetResponderCapture = useCallback(
    (event: EventTypes) => {
      event.persist();
      onEvent(event);
      return false;
    },
    [onEvent]
  );

  const context = useMemo(() => ({ subscribe }), [subscribe]);

  return createElement(
    EventContext.Provider,
    { value: context },
    createElement(
      View,
      {
        style: StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture,
      },
      children
    )
  );
}

export function useEvent(handler: HandlerType, dependencies: readonly unknown[]) {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event');
  }

  useEffect(() => context.subscribe(handler), [context, handler, ...dependencies]);
}
