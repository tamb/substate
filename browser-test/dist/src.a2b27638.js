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
})({"node_modules/deep-clone-simple/index.js":[function(require,module,exports) {
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

},{}],"node_modules/substate/dist/index.js":[function(require,module,exports) {
var define;
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("deep-clone-simple"),require("object-bystring")):"function"==typeof define&&define.amd?define(["exports","deep-clone-simple","object-bystring"],e):e((t=t||self).substate={},t.deepclone,t.byString)}(this,(function(t,e,s){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,s=s&&s.hasOwnProperty("default")?s.default:s;class a{constructor(){this.events={}}on(t,e){this.events[t]=this.events[t]||[],this.events[t].push(e)}off(t,e){if(this.events[t])for(var s=0;s<this.events[t].length;s++)if(this.events[t][s]===e){this.events[t].splice(s,1);break}}emit(t,e){this.events[t]&&this.events[t].forEach((function(t,s){t(e)}))}}const r="UPDATE_STATE";class i extends a{constructor(t={}){super(),this.name=t.name||"SubStateInstance",this.afterUpdate=t.afterUpdate||[],this.beforeUpdate=t.beforeUpdate||[],this.currentState=t.currentState||0,this.stateStorage=t.stateStorage||[],this.defaultDeep=t.defaultDeep||!1,t.state&&this.stateStorage.push(t.state),this.init()}init(){this.on(r,this.updateState.bind(this))}getState(t){return this.stateStorage[t]}getCurrentState(t){return this.getState(this.currentState)}getProp(t){return s(this.getCurrentState(),t)}changeState(t){this.currentState=t.requestedState,this.emit(t.$type||"STATE_CHANGED",this.getCurrentState())}resetState(){this.currentState=0,this.stateStorage=[this.stateStorage[0]],this.emit("STATE_RESET")}pushState(t){this.stateStorage.push(t),this.currentState=this.stateStorage.length-1}updateState(t){let a;this.beforeUpdate.length>0&&this.beforeUpdate.forEach(e=>e(this,t)),a=t.$deep||this.defaultDeep?e(this.getCurrentState()):Object.assign({},this.getCurrentState());for(let e in t)t.hasOwnProperty(e)&&s(a,e,t[e]);!this.defaultDeep&&(a.$deep=!1),t.$type||(a.$type=r),this.pushState(a),this.afterUpdate.length>0&&this.afterUpdate.forEach(t=>t(this)),this.emit(t.$type||"STATE_UPDATED",this.getCurrentState())}}t.mergeStores=function(t,e={}){let s={},a={},r=!1,n=[],h=[];t.forEach(e=>{s=Object.assign(e.getCurrentState()||{},s);for(let t in e.events)a[t]?a[t]=e.events[t].concat(a[t]):a[t]=e.events[t].slice(0);e.defaultDeep&&(r=!0),a.UPDATE_STATE=a.UPDATE_STATE.slice(t.length-1),n=e.beforeUpdate.concat(n),h=e.afterUpdate.concat(h)}),e.state=s,e.defaultDeep=e.defaultDeep||r,e.afterUpdate=h,e.beforeUpdate=n;const o=new i(e);return o.events=Object.assign(o.events,a),o},t.substate=i,Object.defineProperty(t,"__esModule",{value:!0})}));

},{"deep-clone-simple":"node_modules/deep-clone-simple/index.js","object-bystring":"node_modules/object-bystring/dist/index.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
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
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/form/formState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createTodo = void 0;

var _substate = require("substate");

var store = new _substate.substate({
  name: "formState",
  state: {
    todos: []
  }
});

var createTodo = function createTodo(text) {
  var newState = {
    // $type: "ADD_TODO",
    todos: [text]
  };
  store.emit("UPDATE_STATE", newState);
};

exports.createTodo = createTodo;
var _default = store;
exports.default = _default;
},{"substate":"node_modules/substate/dist/index.js"}],"src/form/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wireForm;

var _formState = require("./formState");

function wireForm() {
  var form = document.querySelector('[data-ref="form"]');
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = e.target.querySelector("input").value;

    if (text.length > 0) {
      (0, _formState.createTodo)(text);
    }
  });
}
},{"./formState":"src/form/formState.js"}],"src/list/listState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addTodoList = void 0;

var _substate = require("substate");

var store = new _substate.substate({
  name: "listState"
});

var addTodoList = function addTodoList(state) {
  return state.getProp("todos").map(function (todo) {
    return "<li>".concat(todo, "</li>");
  });
};

exports.addTodoList = addTodoList;
var _default = store;
exports.default = _default;
},{"substate":"node_modules/substate/dist/index.js"}],"src/list/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wireList;

var _listState = _interopRequireWildcard(require("./listState"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function wireList() {
  var list = document.querySelector('[data-ref="list"]');

  function addIt() {
    console.log("oh");
    list.innerHTML = (0, _listState.addTodoList)();
  }

  _listState.default.on("STATE_UPDATED", addIt);

  console.log(_listState.default);
}
},{"./listState":"src/list/listState.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _substate = require("substate");

require("./styles.css");

var _form = _interopRequireDefault(require("./form/form"));

var _list = _interopRequireDefault(require("./list/list"));

var _listState = _interopRequireDefault(require("./list/listState"));

var _formState = _interopRequireDefault(require("./form/formState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _form.default)();
(0, _list.default)();
var store = (0, _substate.mergeStores)([_listState.default, _formState.default], {
  name: "mergedStore"
});
console.log(store);
},{"substate":"node_modules/substate/dist/index.js","./styles.css":"src/styles.css","./form/form":"src/form/form.js","./list/list":"src/list/list.js","./list/listState":"src/list/listState.js","./form/formState":"src/form/formState.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46389" + '/');

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