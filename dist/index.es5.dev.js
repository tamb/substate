(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory(require("object-bystring")))
    : typeof define === "function" && define.amd
    ? define(["object-bystring"], factory)
    : ((global = global || self), (global.substate = factory(global.byString)));
})(this, function (byString) {
  "use strict";

  byString =
    byString && Object.prototype.hasOwnProperty.call(byString, "default")
      ? byString["default"]
      : byString;

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  /**
   * Created by root on 6/27/17.
   */
  var PubSub = /** @class */ (function () {
    function PubSub() {
      this.events = {};
    }
    PubSub.prototype.on = function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    };
    PubSub.prototype.off = function (eventName, fn) {
      if (this.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
          if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
          }
        }
      }
    };
    PubSub.prototype.emit = function (eventName, data) {
      // console.log('in emit: ', data);
      if (this.events[eventName]) {
        this.events[eventName].forEach(function (fn, i) {
          // console.log(i, eventName, data);
          fn(data);
        });
      }
    };
    return PubSub;
  })();

  var deepclone = require("deep-clone-simple");
  var S = "UPDATE_STATE";
  var C = "CHANGE_STATE";
  var substate = /** @class */ (function (_super) {
    __extends(substate, _super);
    function substate(obj) {
      var _this = _super.call(this) || this;
      console.log("You are using a dev version of substate");
      _this.name = obj.name || "SubStateInstance";
      _this.afterUpdate = obj.afterUpdate || [];
      _this.beforeUpdate = obj.beforeUpdate || [];
      _this.currentState = obj.currentState || 0;
      _this.stateStorage = obj.stateStorage || [];
      _this.defaultDeep = obj.defaultDeep || false;
      if (obj.state) _this.stateStorage.push(obj.state);
      _this.on(S, _this.updateState.bind(_this));
      _this.on(C, _this.changeState.bind(_this));
      return _this;
    }
    substate.prototype.getState = function (index) {
      return this.stateStorage[index];
    };
    substate.prototype.getCurrentState = function () {
      return this.getState(this.currentState);
    };
    substate.prototype.getProp = function (prop) {
      return byString(this.getCurrentState(), prop);
    };
    substate.prototype.changeState = function (action) {
      this.currentState = action.$requestedState;
      this.emit(action.$type || "STATE_CHANGED", this.getCurrentState());
    };
    substate.prototype.resetState = function () {
      this.currentState = 0;
      this.stateStorage = [this.stateStorage[0]];
      this.emit("STATE_RESET");
    };
    // Updates the state history array and sets the currentState pointer properly
    substate.prototype.pushState = function (newState) {
      this.stateStorage.push(newState);
      this.currentState = this.stateStorage.length - 1;
      console.log("State Pushed");
    };
    substate.prototype.updateState = function (action) {
      var _this = this;
      this.beforeUpdate.length > 0
        ? this.beforeUpdate.forEach(function (func) {
            return func(_this, action);
          })
        : null;
      var newState;
      if (action.$deep || this.defaultDeep) {
        newState = deepclone(this.getCurrentState()); // deep clonse
      } else {
        newState = Object.assign({}, this.getCurrentState()); // shallow clone
      }
      //update temp new state
      for (var key in action) {
        console.log("replacing key ", key);
        if (action.hasOwnProperty(key)) byString(newState, key, action[key]);
        //update cloned state
      }
      this.defaultDeep ? null : (newState.$deep = false); // reset $deep keyword
      console.log("New State: ", newState);
      console.log("Inside this store: ", this.name);
      if (!action.$type) newState.$type = S;
      //pushes new state
      this.pushState(newState);
      this.afterUpdate.length > 0
        ? this.afterUpdate.forEach(function (func) {
            return func(_this);
          })
        : null;
      this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
    };
    return substate;
  })(PubSub);

  return substate;
});
