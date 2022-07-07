// define window to avoid conflicts with dom and react-native types
declare global {
  interface Document {}
  interface Window {
    document: Document;
  }
}
declare const window: Window & typeof globalThis;

// @ts-ignore
import native from './native.tsx';
import type {
  EventTypes as EventTypesNative,
  HandlerType as HandlerTypeNative,
  EventContextType as EventContextTypeNative,
} from './native';
import dom from 'react-dom-event';
import type {
  EventTypes as EventTypesDOM,
  HandlerType as HandlerTypeDOM,
  EventContextType as EventContextTypeDOM,
} from 'react-dom-event';

export type EventTypes = EventTypesNative | EventTypesDOM;
export type HandlerType = HandlerTypeNative | HandlerTypeDOM;
export type EventContextType = EventContextTypeNative | EventContextTypeDOM;

let EventContextUniversal:
  | typeof native.EventContext
  | typeof dom.EventContext
  | null = null;
let EventProviderUniversal:
  | typeof native.EventProvider
  | typeof dom.EventProvider
  | null = null;
let useEventUniversal: typeof native.useEvent | typeof dom.useEvent | null =
  null;
if (window?.document) {
  EventContextUniversal = dom.EventContext;
  EventProviderUniversal = dom.EventProvider;
  useEventUniversal = dom.useEvent;
} else {
  EventContextUniversal = native.EventContext;
  EventProviderUniversal = native.EventProvider;
  useEventUniversal = native.useEvent;
}
export const EventContext = EventContextUniversal;
export const EventProvider = EventProviderUniversal;
export const useEvent = useEventUniversal;
