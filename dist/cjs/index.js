"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventProvider = EventProvider;
exports.useEvent = useEvent;
exports.EventContext = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = _interopRequireDefault(require("react-native"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var EventContext = /*#__PURE__*/ _react.default.createContext(undefined);
exports.EventContext = EventContext;
function EventProvider(param) {
    var children = param.children;
    var onEvent = function onEvent(event) {
        handlers.forEach(function(subscriber) {
            return subscriber(event);
        });
    };
    var subscribe = function subscribe(handler) {
        handlers.push(handler);
        return function() {
            return handlers.splice(handlers.indexOf(handler), 1);
        };
    };
    var state = _react.default.useState([]);
    var handlers = state[0];
    return /*#__PURE__*/ _react.default.createElement(EventContext.Provider, {
        value: {
            subscribe: subscribe
        }
    }, /*#__PURE__*/ _react.default.createElement(_reactNative.default.View, {
        style: _reactNative.default.StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture: function(event) {
            event.persist();
            onEvent(event);
            return false;
        }
    }, children));
}
function useEvent(handler, dependencies) {
    var context = _react.default.useContext(EventContext);
    if (!context) {
        throw new Error("react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event");
    }
    _react.default.useEffect(function() {
        return context.subscribe(handler);
    }, [
        context.subscribe,
        handler
    ].concat(dependencies));
}
