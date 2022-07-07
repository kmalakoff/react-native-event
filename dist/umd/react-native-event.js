(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-native'), require('react-dom-event')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-native', 'react-dom-event'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactNativeEvent = {}, global.React, global.ReactNative, global.reactDomEvent));
})(this, (function (exports, React, ReactNative, dom) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactNative__default = /*#__PURE__*/_interopDefaultLegacy(ReactNative);
  var dom__default = /*#__PURE__*/_interopDefaultLegacy(dom);

  function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
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
  var EventContext$1 = /*#__PURE__*/ React__default["default"].createContext(undefined);
  function EventProvider$1(param) {
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
      var ref = _slicedToArray(React__default["default"].useState([]), 1), handlers = ref[0];
      return /*#__PURE__*/ React__default["default"].createElement(EventContext$1.Provider, {
          value: {
              subscribe: subscribe
          }
      }, /*#__PURE__*/ React__default["default"].createElement(ReactNative__default["default"].View, {
          style: ReactNative__default["default"].StyleSheet.absoluteFill,
          onStartShouldSetResponderCapture: function(event) {
              event.persist();
              onEvent(event);
              return false;
          }
      }, children));
  }
  function useEvent$1(handler, dependencies) {
      var subscribe = React__default["default"].useContext(EventContext$1).subscribe;
      React__default["default"].useEffect(function() {
          return subscribe(handler);
      }, [
          subscribe,
          handler
      ].concat(dependencies));
  }
  var native = {
      EventContext: EventContext$1,
      EventProvider: EventProvider$1,
      useEvent: useEvent$1
  };

  // @ts-ignore
  var EventContextUniversal = null;
  var EventProviderUniversal = null;
  var useEventUniversal = null;
  if (window === null || window === void 0 ? void 0 : window.document) {
      EventContextUniversal = dom__default["default"].EventContext;
      EventProviderUniversal = dom__default["default"].EventProvider;
      useEventUniversal = dom__default["default"].useEvent;
  } else {
      EventContextUniversal = native.EventContext;
      EventProviderUniversal = native.EventProvider;
      useEventUniversal = native.useEvent;
  }
  var EventContext = EventContextUniversal;
  var EventProvider = EventProviderUniversal;
  var useEvent = useEventUniversal;

  exports.EventContext = EventContext;
  exports.EventProvider = EventProvider;
  exports.useEvent = useEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-native-event.js.map
