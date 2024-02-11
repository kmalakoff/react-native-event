(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-native')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-native'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reactNativeEvent = {}, global.React, global.ReactNative));
})(this, (function (exports, react, reactNative) { 'use strict';

  var EventContext = react.createContext(undefined);
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
      var state = react.useState([]);
      var handlers = state[0];
      return react.createElement(EventContext.Provider, {
          value: {
              subscribe: subscribe
          }
      }, react.createElement(reactNative.View, {
          style: reactNative.StyleSheet.absoluteFill,
          onStartShouldSetResponderCapture: function(event) {
              event.persist();
              onEvent(event);
              return false;
          }
      }, children));
  }
  function useEvent(handler, dependencies) {
      var context = react.useContext(EventContext);
      if (!context) {
          throw new Error("react-native-event: subscribe not found on context. You might be missing the EventProvider or have multiple instances of react-native-event");
      }
      // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      react.useEffect(function() {
          return context.subscribe(handler);
      }, [
          context.subscribe,
          handler
      ].concat(dependencies));
  }

  exports.EventContext = EventContext;
  exports.EventProvider = EventProvider;
  exports.useEvent = useEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-native-event.js.map
