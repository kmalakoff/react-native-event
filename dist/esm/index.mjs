// @ts-ignore
import native from './native.mjs';
import dom from 'react-dom-event';
let EventContextUniversal = null;
let EventProviderUniversal = null;
let useEventUniversal = null;
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
