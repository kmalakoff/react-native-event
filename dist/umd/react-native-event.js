(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-native')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-native'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactNativeEvent = {}, global.React, global.ReactNative));
})(this, (function (exports, React, ReactNative) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactNative__default = /*#__PURE__*/_interopDefaultLegacy(ReactNative);

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
  var EventContext = /*#__PURE__*/ React__default["default"].createContext(undefined);
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
      var ref = _slicedToArray(React__default["default"].useState([]), 1), handlers = ref[0];
      return /*#__PURE__*/ React__default["default"].createElement(EventContext.Provider, {
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
  function useEvent(handler, dependencies) {
      var context = React__default["default"].useContext(EventContext);
      if (!context.subscribe) throw new Error("react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event");
      React__default["default"].useEffect(function() {
          return context.subscribe(handler);
      }, [
          context.subscribe,
          handler
      ].concat(dependencies));
  }
  var index = {
      EventContext: EventContext,
      EventProvider: EventProvider,
      useEvent: useEvent
  };

  exports.EventContext = EventContext;
  exports.EventProvider = EventProvider;
  exports["default"] = index;
  exports.useEvent = useEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-native-event.js.map
