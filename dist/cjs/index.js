"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.useEvent = exports.EventProvider = exports.EventContext = void 0;
var _nativeTsx = _interopRequireDefault(require("./native.js"));
var _reactDomEvent = _interopRequireDefault(require("react-dom-event"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var EventContextUniversal = null;
var EventProviderUniversal = null;
var useEventUniversal = null;
if (window === null || window === void 0 ? void 0 : window.document) {
    EventContextUniversal = _reactDomEvent.default.EventContext;
    EventProviderUniversal = _reactDomEvent.default.EventProvider;
    useEventUniversal = _reactDomEvent.default.useEvent;
} else {
    EventContextUniversal = _nativeTsx.default.EventContext;
    EventProviderUniversal = _nativeTsx.default.EventProvider;
    useEventUniversal = _nativeTsx.default.useEvent;
}
var EventContext = EventContextUniversal;
exports.EventContext = EventContext;
var EventProvider = EventProviderUniversal;
exports.EventProvider = EventProvider;
var useEvent = useEventUniversal;
exports.useEvent = useEvent;
