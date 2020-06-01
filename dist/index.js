!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e(require("object-bystring")))
    : "function" == typeof define && define.amd
    ? define(["object-bystring"], e)
    : ((t = t || self).substate = e(t.byString));
})(this, function (t) {
  "use strict";
  t = t && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
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
  var e = function (t, n) {
    return (e =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, e) {
          t.__proto__ = e;
        }) ||
      function (t, e) {
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
      })(t, n);
  };
  var n = (function () {
      function t() {
        this.events = {};
      }
      return (
        (t.prototype.on = function (t, e) {
          (this.events[t] = this.events[t] || []), this.events[t].push(e);
        }),
        (t.prototype.off = function (t, e) {
          if (this.events[t])
            for (var n = 0; n < this.events[t].length; n++)
              if (this.events[t][n] === e) {
                this.events[t].splice(n, 1);
                break;
              }
        }),
        (t.prototype.emit = function (t, e) {
          this.events[t] &&
            this.events[t].forEach(function (t, n) {
              t(e);
            });
        }),
        t
      );
    })(),
    r = require("deep-clone-simple"),
    o = "UPDATE_STATE";
  return (function (n) {
    function i(t) {
      void 0 === t && (t = {});
      var e = n.call(this) || this;
      return (
        (e.name = t.name || "SubStateInstance"),
        (e.afterUpdate = t.afterUpdate || []),
        (e.beforeUpdate = t.beforeUpdate || []),
        (e.currentState = t.currentState || 0),
        (e.stateStorage = t.stateStorage || []),
        (e.defaultDeep = t.defaultDeep || !1),
        t.state && e.stateStorage.push(t.state),
        e.on(o, e.updateState.bind(e)),
        e.on("CHANGE_STATE", e.changeState.bind(e)),
        e
      );
    }
    return (
      (function (t, n) {
        function r() {
          this.constructor = t;
        }
        e(t, n),
          (t.prototype =
            null === n
              ? Object.create(n)
              : ((r.prototype = n.prototype), new r()));
      })(i, n),
      (i.prototype.getState = function (t) {
        return this.stateStorage[t];
      }),
      (i.prototype.getCurrentState = function () {
        return this.getState(this.currentState);
      }),
      (i.prototype.getProp = function (e) {
        return t(this.getCurrentState(), e);
      }),
      (i.prototype.changeState = function (t) {
        (this.currentState = t.$requestedState),
          this.emit(t.$type || "STATE_CHANGED", this.getCurrentState());
      }),
      (i.prototype.resetState = function () {
        (this.currentState = 0),
          (this.stateStorage = [this.stateStorage[0]]),
          this.emit("STATE_RESET");
      }),
      (i.prototype.pushState = function (t) {
        this.stateStorage.push(t),
          (this.currentState = this.stateStorage.length - 1);
      }),
      (i.prototype.updateState = function (e) {
        var n,
          i = this;
        for (var a in (this.beforeUpdate.length > 0 &&
          this.beforeUpdate.forEach(function (t) {
            return t(i, e);
          }),
        (n =
          e.$deep || this.defaultDeep
            ? r(this.getCurrentState())
            : Object.assign({}, this.getCurrentState())),
        e))
          e.hasOwnProperty(a) && t(n, a, e[a]);
        !this.defaultDeep && (n.$deep = !1),
          e.$type || (n.$type = o),
          this.pushState(n),
          this.afterUpdate.length > 0 &&
            this.afterUpdate.forEach(function (t) {
              return t(i);
            }),
          this.emit(e.$type || "STATE_UPDATED", this.getCurrentState());
      }),
      i
    );
  })(n);
});
