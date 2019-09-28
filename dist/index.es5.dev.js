(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('deep-clone-simple'), require('object-bystring')) :
  typeof define === 'function' && define.amd ? define(['deep-clone-simple', 'object-bystring'], factory) :
  (global = global || self, global.substate = factory(global.deepclone, global.byString));
}(this, function (deepclone, byString) { 'use strict';

  deepclone = deepclone && deepclone.hasOwnProperty('default') ? deepclone['default'] : deepclone;
  byString = byString && byString.hasOwnProperty('default') ? byString['default'] : byString;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  /**
   * Created by root on 6/27/17.
   */
  var PubSub =
  /*#__PURE__*/
  function () {
    function PubSub() {
      _classCallCheck(this, PubSub);

      this.events = {};
    }

    _createClass(PubSub, [{
      key: "on",
      value: function on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
      }
    }, {
      key: "off",
      value: function off(eventName, fn) {
        if (this.events[eventName]) {
          for (var i = 0; i < this.events[eventName].length; i++) {
            if (this.events[eventName][i] === fn) {
              this.events[eventName].splice(i, 1);
              break;
            }
          }
        }
      }
    }, {
      key: "emit",
      value: function emit(eventName, data) {
        // console.log('in emit: ', data);
        if (this.events[eventName]) {
          this.events[eventName].forEach(function (fn, i) {
            // console.log(i, eventName, data);
            fn(data);
          });
        }
      }
    }]);

    return PubSub;
  }();

  var S = "UPDATE_STATE";
  var C = "CHANGE_STATE";

  var substate =
  /*#__PURE__*/
  function (_PubSub) {
    _inherits(substate, _PubSub);

    function substate() {
      var _this;

      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, substate);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(substate).call(this));
      console.log("You are using a dev version of substate");
      _this.name = obj.name || "SubStateInstance";
      _this.afterUpdate = obj.afterUpdate || [];
      _this.beforeUpdate = obj.beforeUpdate || [];
      _this.currentState = obj.currentState || 0;
      _this.stateStorage = obj.stateStorage || [];
      _this.defaultDeep = obj.defaultDeep || false;
      if (obj.state) _this.stateStorage.push(obj.state);

      _this.on(S, _this.updateState.bind(_assertThisInitialized(_this)));

      _this.on(C, _this.changeState.bind(_assertThisInitialized(_this)));

      return _this;
    }

    _createClass(substate, [{
      key: "getState",
      value: function getState(index) {
        return this.stateStorage[index];
      }
    }, {
      key: "getCurrentState",
      value: function getCurrentState(s) {
        return this.getState(this.currentState);
      }
    }, {
      key: "getProp",
      value: function getProp(prop) {
        return byString(this.getCurrentState(), prop);
      }
    }, {
      key: "changeState",
      value: function changeState(action) {
        this.currentState = action.requestedState;
        this.emit(action.$type || "STATE_CHANGED", this.getCurrentState());
      }
    }, {
      key: "resetState",
      value: function resetState() {
        this.currentState = 0;
        this.stateStorage = [this.stateStorage[0]];
        this.emit("STATE_RESET");
      } // Updates the state history array and sets the currentState pointer properly

    }, {
      key: "pushState",
      value: function pushState(newState) {
        this.stateStorage.push(newState);
        this.currentState = this.stateStorage.length - 1;
        console.log("State Pushed");
      }
    }, {
      key: "updateState",
      value: function updateState(action) {
        var _this2 = this;

        this.beforeUpdate.length > 0 ? this.beforeUpdate.forEach(function (func) {
          return func(_this2, action);
        }) : null;
        var newState;

        if (action.$deep || this.defaultDeep) {
          newState = deepclone(this.getCurrentState()); // deep clonse
        } else {
          newState = Object.assign({}, this.getCurrentState()); // shallow clone
        } //update temp new state


        for (var key in action) {
          console.log("replacing key ", key);
          if (action.hasOwnProperty(key)) byString(newState, key, action[key]); //update cloned state
        }

        this.defaultDeep ? null : newState.$deep = false; // reset $deep keyword

        console.log("New State: ", newState);
        console.log('Inside this store: ', this.name);
        if (!action.$type) newState.$type = S; //pushes new state

        this.pushState(newState);
        this.afterUpdate.length > 0 ? this.afterUpdate.forEach(function (func) {
          return func(_this2);
        }) : null;
        this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
      }
    }]);

    return substate;
  }(PubSub);

  return substate;

}));
