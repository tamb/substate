// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"node_modules/deep-clone-simple/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deepcopy;

function deepcopy(value) {
  if (!(!!value && typeof value == 'object')) {
    return value;
  }

  if (Object.prototype.toString.call(value) == '[object Date]') {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.map(deepcopy);
  }

  var result = {};
  Object.keys(value).forEach(function (key) {
    result[key] = deepcopy(value[key]);
  });
  return result;
}
},{}],"node_modules/object-bystring/dist/index.js":[function(require,module,exports) {
var define;
!function(e){"function"==typeof define&&define.amd?define(e):e()}(function(){"use strict";module.exports=function(e,n,t){for(var i=e,r=(n=(n=n.toString().replace(/\[(\w+)\]/g,".$1")).toString().replace(/^\./,"")).split("."),o=0;o<r.length;++o){var f=r[o];f in i?i.hasOwnProperty(f)&&(void 0!==t&&o===r.length-1&&(i[f]=t),i=i[f]):i[f]=t}return i}});

},{}],"node_modules/substate/dist/index.dev.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('deep-clone-simple'), require('object-bystring')) :
    typeof define === 'function' && define.amd ? define(['deep-clone-simple', 'object-bystring'], factory) :
    (global = global || self, global.substate = factory(global.deepclone, global.byString));
}(this, function (deepclone, byString) { 'use strict';

    deepclone = deepclone && deepclone.hasOwnProperty('default') ? deepclone['default'] : deepclone;
    byString = byString && byString.hasOwnProperty('default') ? byString['default'] : byString;

    /**
     * Created by root on 6/27/17.
     */
    class PubSub{
        constructor(){
            this.events = {};

        }

        on(eventName, fn){

            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(fn);

        }

        off(eventName, fn) {
            if (this.events[eventName]) {
                for (var i = 0; i < this.events[eventName].length; i++) {
                    if (this.events[eventName][i] === fn) {
                        this.events[eventName].splice(i, 1);
                        break;
                    }
                }
            }
        }

        emit(eventName, data) {
            // console.log('in emit: ', data);
            if (this.events[eventName]) {
                this.events[eventName].forEach(function(fn, i) {
                    // console.log(i, eventName, data);
                    fn(data);
                });
            }
        }

    }

    const S = "UPDATE_STATE";
    const C = "CHANGE_STATE";

    class substate extends PubSub {
      constructor(obj = {}) {
        super();
        console.log("You are using a dev version of substate");

        this.name = obj.name || "SubStateInstance";
        this.afterUpdate = obj.afterUpdate || [];
        this.beforeUpdate = obj.beforeUpdate || [];
        this.currentState = obj.currentState || 0;
        this.stateStorage = obj.stateStorage || [];
        this.defaultDeep = obj.defaultDeep || false;

        if (obj.state) this.stateStorage.push(obj.state);
        this.on(S, this.updateState.bind(this));
        this.on(C, this.changeState.bind(this));
      }

      getState(index) {
        return this.stateStorage[index];
      }

      getCurrentState(s) {
        return this.getState(this.currentState);
      }

      getProp(prop) {
        return byString(this.getCurrentState(), prop);
      }

      changeState(action) {
        this.currentState = action.requestedState;
        this.emit(action.$type || "STATE_CHANGED", this.getCurrentState());
      }

      resetState() {
        this.currentState = 0;
        this.stateStorage = [this.stateStorage[0]];
        this.emit("STATE_RESET");
      }

      // Updates the state history array and sets the currentState pointer properly
      pushState(newState) {
        this.stateStorage.push(newState);
        this.currentState = this.stateStorage.length - 1;
        console.log("State Pushed");
      }

      updateState(action) {
        this.beforeUpdate.length > 0
          ? this.beforeUpdate.forEach(func => func(this, action))
          : null;
        let newState;
        if (action.$deep || this.defaultDeep) {
          newState = deepclone(this.getCurrentState()); // deep clonse
        } else {
          newState = Object.assign({}, this.getCurrentState()); // shallow clone
        }

        //update temp new state
        for (let key in action) {
          console.log("replacing key ", key);
          if (action.hasOwnProperty(key)) byString(newState, key, action[key]);
          //update cloned state
        }

        this.defaultDeep ? null : (newState.$deep = false); // reset $deep keyword

        console.log("New State: ", newState);
        console.log('Inside this store: ', this.name);

        if (!action.$type) newState.$type = S;

        //pushes new state
        this.pushState(newState);

        this.afterUpdate.length > 0
          ? this.afterUpdate.forEach(func => func(this))
          : null;
        this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
      }
    }

    return substate;

}));

},{"deep-clone-simple":"node_modules/deep-clone-simple/index.js","object-bystring":"node_modules/object-bystring/dist/index.js"}],"src/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _indexDev = _interopRequireDefault(require("substate/dist/index.dev.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = new _indexDev.default({
  state: {
    todos: []
  }
});
exports.store = store;
},{"substate/dist/index.dev.js":"node_modules/substate/dist/index.dev.js"}],"src/form/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wireForm;

var _state = require("../state");

function createTodo(text) {
  var newState = {
    $type: "UPDATE_TODO",
    todos: _state.store.getProp('todos').concat([text])
  };

  _state.store.emit("UPDATE_STATE", newState);
}

;

function wireForm() {
  var form = document.querySelector('[data-ref="form"]');
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = e.target.querySelector("input");
    var text = input.value;

    if (text.length > 0) {
      createTodo(text);
      input.value = '';
    }
  });
}
},{"../state":"src/state.js"}],"src/list/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wireList;

var _state = require("../state");

var list = null;

function wireList() {
  list = document.querySelector('[data-ref="list"]');

  _state.store.on('UPDATE_TODO', addIt);
}

function addIt(state) {
  var html = "";
  state.todos.map(function (todo) {
    return "<li>".concat(todo, "</li>");
  }).forEach(function (li) {
    html += li;
  });
  list.innerHTML = html;
}
},{"../state":"src/state.js"}],"src/undoredo/undoredo.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wireUndoRedo;

var _state = require("../state");

function wireUndoRedo() {
  var undo = document.querySelector('[data-ref="undo"]');
  var redo = document.querySelector('[data-ref="redo"]');
  redo.addEventListener("click", function () {
    if (_state.store.currentState !== _state.store.stateStorage.length - 1) {
      _state.store.emit("CHANGE_STATE", {
        requestedState: _state.store.currentState + 1,
        $type: "UPDATE_TODO"
      });
    }
  });
  undo.addEventListener("click", function () {
    if (_state.store.currentState !== 0) {
      _state.store.emit("CHANGE_STATE", {
        requestedState: _state.store.currentState - 1,
        $type: "UPDATE_TODO"
      });
    }
  });
}
},{"../state":"src/state.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

require("./styles.css");

var _form = _interopRequireDefault(require("./form/form"));

var _list = _interopRequireDefault(require("./list/list"));

var _undoredo = _interopRequireDefault(require("./undoredo/undoredo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _form.default)();
(0, _list.default)();
(0, _undoredo.default)();
},{"./styles.css":"src/styles.css","./form/form":"src/form/form.js","./list/list":"src/list/list.js","./undoredo/undoredo":"src/undoredo/undoredo.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33891" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map