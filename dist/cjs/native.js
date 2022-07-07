"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventProvider = EventProvider;
exports.useEvent = useEvent;
module.exports = exports.EventContext = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = _interopRequireDefault(require("react-native"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
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
    var ref = _slicedToArray(_react.default.useState([]), 1), handlers = ref[0];
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
    var subscribe = _react.default.useContext(EventContext).subscribe;
    _react.default.useEffect(function() {
        return subscribe(handler);
    }, [
        subscribe,
        handler
    ].concat(dependencies));
}
var _default = {
    EventContext: EventContext,
    EventProvider: EventProvider,
    useEvent: useEvent
};
module.exports = _default;
