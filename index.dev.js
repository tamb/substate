(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SubState"] = factory();
	else
		root["SubState"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(1);

var _PubSub2 = __webpack_require__(2);

var _PubSub3 = _interopRequireDefault(_PubSub2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) {
        // .length of function is 2
        'use strict';

        if (target == null) throw new TypeError('Cannot convert undefined or null to object');
        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
                // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    };
}

var S = 'UPDATE_STATE';
var C = 'UPDATE_CHUNK';

var SubState = function (_PubSub) {
    _inherits(SubState, _PubSub);

    function SubState(objParam, inst) {
        _classCallCheck(this, SubState);

        var _this = _possibleConstructorReturn(this, (SubState.__proto__ || Object.getPrototypeOf(SubState)).call(this));

        console.warn('\n        "Yoooo. You are using a Development version of SubState (npm substate, etc.).\n    /( \'0\')/\n        ');

        var obj = objParam || {};

        _this.name = obj.name || "SubStateInstance";

        _this.currentState = obj.currentState || 0;
        _this.stateStorage = obj.stateStorage || [];
        _this.saveOnChange = obj.saveOnChange || null;
        _this.pullFromLocal = obj.pullFromLocal || null;

        if (obj.state) _this.stateStorage.push(obj.state);
        _this.init();

        return _this;
    }

    _createClass(SubState, [{
        key: 'init',
        value: function init() {
            this.on(S, this.updateState.bind(this));
            this.on(C, this.updateChunk.bind(this));

            if (this.pullFromLocal) {
                if (window.localStorage[this.name]) {
                    var state = JSON.parse(window.localStorage.getItem(this.name));
                    this.currentState = state.currentState;
                    this.stateStorage = state.stateStorage;
                }
            }
        }
    }, {
        key: 'getState',
        value: function getState(index) {
            return this.stateStorage[index];
        }
    }, {
        key: 'getCurrentState',
        value: function getCurrentState(s) {
            return this.getState(this.currentState);
        }
    }, {
        key: 'getProp',
        value: function getProp(prop) {
            //TODO does not work need to rewrite since object.bystring is rewritten
            return this.getCurrentState().byString(prop);
        }
    }, {
        key: 'changeState',
        value: function changeState(action) {
            this.currentState = action.requestedState;
            this.emit(action.$type || 'STATE_CHANGED', this.getCurrentState());
        }
    }, {
        key: 'saveState',
        value: function saveState() {
            var obj = {
                currentState: this.currentState,
                stateStorage: this.stateStorage
            };

            window.localStorage.setItem(this.name, JSON.stringify(obj));
            this.emit('STATE_SAVED', this.getCurrentState());
        }
    }, {
        key: 'removeSavedState',
        value: function removeSavedState() {
            window.localStorage.removeItem(this.name);
            this.emit('STATE_REMOVED_SAVED_STATE');
        }
    }, {
        key: 'resetState',
        value: function resetState() {
            this.currentState = 0;
            this.stateStorage = [this.stateStorage[0]];
            this.emit('STATE_RESET');
        }

        // Updates the state history array and sets the currentState pointer properly

    }, {
        key: 'pushState',
        value: function pushState(newState) {
            this.stateStorage.push(newState);
            this.currentState = this.stateStorage.length - 1;
            console.log('State Pushed');
        }
    }, {
        key: 'updateChunk',
        value: function updateChunk(action) {
            //DOESNT WORK

            var newChunk = {};
            var newState = Object.assign({}, this.getCurrentState()); //clone state

            //update temp new state
            for (var key in action) {
                if (action.hasOwnProperty(key)) {
                    newState.byString(key, action[key]); //update cloned state
                    newChunk[key] = action[key]; //create chunk

                    //**NOTE: 01-AA** this is a performance cheat.  I'm not retrieving current state.
                    //...I'm building the chunk from the passed in action this avoids another
                    //...loop to build the chunk from the current state
                    //...this assumption is that the state update will be successful and that
                    //...there is no altered data from here until the next call of
                    //...'UPDATE_STATE' or 'UPDATE_CHUNK'
                }
            }

            if (!action.$type) newState.$type = C;

            //pushes new state
            this.pushState(newState);

            // //retrieve only chunk
            //**NOTE: State: 01-AB** this is the legit way to do it.  See note 01-AA
            // for (var key in action) {
            //     if(action.hasOwnProperty(key)){
            //         console.log('key value: ',action[key]);
            //         newChunk[this.getProp(key)] = action[key];//create chunk
            //     }
            // }

            this.emit(action.$type || 'CHUNK_UPDATED', newChunk); //emit with latest data

            if (this.saveOnChange) this.saveState();
        }
    }, {
        key: 'updateState',
        value: function updateState(action) {
            var newState = Object.assign({}, this.getCurrentState()); //clone state

            //update temp new state
            for (var key in action) {
                console.log('replacing key ', key);
                if (action.hasOwnProperty(key)) newState.byString(key, action[key]);
                //update cloned state
            }

            console.log('New State: ', newState);

            if (!action.$type) newState.$type = U;

            //pushes new state
            this.pushState(newState);

            this.emit(action.$type || 'STATE_UPDATED', this.getCurrentState()); //emit with latest data

            if (this.saveOnChange) this.saveState();
        }
    }]);

    return SubState;
}(_PubSub3.default);

exports.default = SubState;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define("object-bystring",[],t):"object"==typeof exports?exports["object-bystring"]=t():e["object-bystring"]=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t){Object.prototype.byString||Object.defineProperty(Object.prototype,"byString",{enumerable:!1,configurable:!1,writable:!1,value:function(e,t,r){var n=r||this;e=e.toString().replace(/\[(\w+)\]/g,".$1"),e=e.toString().replace(/^\./,"");for(var o=e.split("."),i=0;i<o.length;++i){var c=o[i];c in n?n.hasOwnProperty(c)&&(void 0!==t&&i===o.length-1&&(n[c]=t),n=n[c]):n[c]=t}return n}})}])});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by root on 6/27/17.
 */
var PubSub = function () {
    function PubSub() {
        _classCallCheck(this, PubSub);

        this.events = {};
    }

    _createClass(PubSub, [{
        key: 'on',
        value: function on(eventName, fn) {

            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(fn);
        }
    }, {
        key: 'off',
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
        key: 'emit',
        value: function emit(eventName, data) {
            console.log('in emit: ', data);
            if (this.events[eventName]) {
                this.events[eventName].forEach(function (fn, i) {
                    console.log(i, eventName, data);
                    fn(data);
                });
            }
        }
    }]);

    return PubSub;
}();

exports.default = PubSub;
;

/***/ })
/******/ ])["default"];
});