import React from 'react';
import ReactNative from 'react-native';
export declare type EventTypes = ReactNative.GestureResponderEvent;
export declare type HandlerType = (event: EventTypes) => void;
export declare type EventContextType = {
    subscribe: (handler: HandlerType) => void;
};
export declare const EventContext: React.Context<EventContextType>;
export declare type EventProviderProps = {
    events?: string[];
    children?: React.ReactNode;
};
export declare function EventProvider({ children }: EventProviderProps): JSX.Element;
export declare function useEvent(handler: any, dependencies: any): void;
declare const _default: {
    EventContext: React.Context<EventContextType>;
    EventProvider: typeof EventProvider;
    useEvent: typeof useEvent;
};
export default _default;
