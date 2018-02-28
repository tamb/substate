!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.SubState=e():t.SubState=e()}("undefined"!=typeof self?self:this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(1),c=(r(u),n(2)),l=r(c),f=function(t){function e(t,n){o(this,e);var r=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));console.warn("\n\n        \"Yoooo. You are using a Development version of SubState (npm substate, etc.).\n        Please run UglifyJS/similar for production mode (to remove comments, and console.logs\n        You can run UglifyJS/similar with options similar to\n        ~~~~~new webpack.optimize.UglifyJsPlugin({ //plugin that minifies js\n                comments: true,// Eliminate comments\n                compress: {\n                    warnings: false, //remove warnings\n                    drop_console: true //remove console.logs\n                },\n                sourceMap: !bool //generate a source map for each minified file\n             })~~~~~\"\n    /( '0')/\n        ");var a=t||{};return r.name=a.name||"SubStateInstance",r.currentState=a.currentState||0,r.stateStorage=a.stateStorage||[],r.saveOnChange=a.saveOnChange||null,r.pullFromLocal=a.pullFromLocal||null,a.state&&r.stateStorage.push(a.state),r}return a(e,t),s(e,[{key:"init",value:function(){if(this.on("UPDATE_STATE",this.updateState.bind(this)),this.on("CHANGE_STATE",this.changeState.bind(this)),this.on("UPDATE_CHUNK",this.updateChunk.bind(this)),this.pullFromLocal&&window.localStorage[this.name]){var t=JSON.parse(window.localStorage.getItem(this.name));this.currentState=t.currentState,this.stateStorage=t.stateStorage}}},{key:"getState",value:function(t){return this.stateStorage[t]}},{key:"getCurrentState",value:function(){return this.getState(this.currentState)}},{key:"getProp",value:function(t){return this.getCurrentState().byString(t)}},{key:"changeState",value:function(t){this.currentState=t.requestedState,this.emit(t.type||"STATE_CHANGED",this.getCurrentState())}},{key:"saveState",value:function(){var t={currentState:this.currentState,stateStorage:this.stateStorage};window.localStorage.setItem(this.name,JSON.stringify(t)),this.emit("STATE_SAVED")}},{key:"removeSavedState",value:function(){window.localStorage.removeItem(this.name),this.emit("STATE_REMOVED_SAVED_STATE")}},{key:"resetState",value:function(){this.currentState=0,this.stateStorage=[this.stateStorage[0]],this.emit("STATE_RESET")}},{key:"pushState",value:function(t){this.stateStorage=this.stateStorage.concat(t),this.currentState=this.stateStorage.length-1}},{key:"updateChunk",value:function(t){var e={},n=Object.assign({},this.getCurrentState());for(var r in t)t.hasOwnProperty(r)&&(n.byString(r,t[r]),e[r]=t[r]);this.pushState(n),this.emit(t.type||"CHUNK_UPDATED",e),this.saveOnChange&&this.saveState()}},{key:"updateState",value:function(t){var e=Object.assign({},this.getCurrentState());for(var n in t)t.hasOwnProperty(n)&&e.byString(n,t[n]);this.pushState(e),this.emit(t.type||"STATE_UPDATED",this.getCurrentState()),this.saveOnChange&&this.saveState()}}]),e}(l.default);e.default=f},function(t,e,n){!function(e,n){t.exports=n()}(0,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e){Object.prototype.byString||Object.defineProperty(Object.prototype,"byString",{enumerable:!1,configurable:!1,writable:!1,value:function(t,e,n){var r=n||this;t=t.toString().replace(/\[(\w+)\]/g,".$1"),t=t.toString().replace(/^\./,"");for(var o=t.split("."),i=0;i<o.length;++i){var a=o[i];a in r?r.hasOwnProperty(a)&&(void 0!==e&&i===o.length-1&&(r[a]=e),r=r[a]):r[a]=e}return r}})}])})},function(t,e,n){"use strict";function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i=function(){function t(e){r(this,t),this.events={},this.pipedEvents={},this.name=e||"PubSub",this.then=function(t){return{}},this.pipe=function(t,e){this.pipedEvents[t]=this.pipedEvents[t]||e}}return o(t,[{key:"on",value:function(t,e){this.events[t]=this.events[t]||[],this.events[t].push(e)}},{key:"off",value:function(t,e){if(this.events[t])for(var n=0;n<this.events[t].length;n++)if(this.events[t][n]===e){this.events[t].splice(n,1);break}}},{key:"emit",value:function(t,e){this.events[t]&&this.events[t].forEach(function(t){t(e)}),this.pipedEvents[t]&&this.pipedEvents[t].reduce(e,currentVal(e))}}]),t}();e.default=i}]).default});