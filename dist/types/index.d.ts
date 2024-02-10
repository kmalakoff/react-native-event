import type { ReactNode } from 'react';
import type { GestureResponderEvent } from 'react-native';
export declare type EventTypes = GestureResponderEvent;
export declare type HandlerType = (event: EventTypes) => void;
export declare type EventContextType = {
    subscribe: (handler: HandlerType) => void;
};
export declare const EventContext: import("react").Context<EventContextType>;
export declare type EventProviderProps = {
    events?: string[];
    children?: ReactNode;
};
export declare function EventProvider({ children }: EventProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<EventContextType>>;
export declare function useEvent(handler: any, dependencies: any): void;
