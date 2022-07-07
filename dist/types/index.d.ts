declare global {
    interface Document {
    }
    interface Window {
        document: Document;
    }
}
import type { EventTypes as EventTypesNative, HandlerType as HandlerTypeNative, EventContextType as EventContextTypeNative } from './native';
import type { EventTypes as EventTypesDOM, HandlerType as HandlerTypeDOM, EventContextType as EventContextTypeDOM } from 'react-dom-event';
export declare type EventTypes = EventTypesNative | EventTypesDOM;
export declare type HandlerType = HandlerTypeNative | HandlerTypeDOM;
export declare type EventContextType = EventContextTypeNative | EventContextTypeDOM;
export declare const EventContext: any;
export declare const EventProvider: any;
export declare const useEvent: any;
