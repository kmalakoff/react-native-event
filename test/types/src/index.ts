import { type EventContextType, EventProvider, type EventProviderProps, type EventTypes, type HandlerType, useEvent } from 'react-native-event';

const dependencies: readonly unknown[] = ['mode'];
const handler: HandlerType = (event) => {
  const eventType: EventTypes = event;
  void eventType;
};
const context = undefined as unknown as EventContextType;
const cleanup: () => void = context.subscribe(handler);
cleanup();
cleanup();
const props: EventProviderProps = { children: null };
// @ts-expect-error: react-native-event has no DOM event configuration
const invalidProps: EventProviderProps = { events: ['press'] };
const provider = EventProvider(props);
useEvent(handler, dependencies);
void provider;
void invalidProps;
