"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EventContext: function() {
        return EventContext;
    },
    EventProvider: function() {
        return EventProvider;
    },
    useEvent: function() {
        return useEvent;
    }
});
var _react = require("react");
var _reactNative = require("react-native");
var EventContext = (0, _react.createContext)(undefined);
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
    var state = (0, _react.useState)([]);
    var handlers = state[0];
    return (0, _react.createElement)(EventContext.Provider, {
        value: {
            subscribe: subscribe
        }
    }, (0, _react.createElement)(_reactNative.View, {
        style: _reactNative.StyleSheet.absoluteFill,
        onStartShouldSetResponderCapture: function(event) {
            event.persist();
            onEvent(event);
            return false;
        }
    }, children));
}
function useEvent(handler, dependencies) {
    var context = (0, _react.useContext)(EventContext);
    if (!context) {
        throw new Error("react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event");
    }
    (0, _react.useEffect)(function() {
        return context.subscribe(handler);
    }, [
        context.subscribe,
        handler
    ].concat(dependencies));
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}