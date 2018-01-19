/**
 * Created by root on 6/27/17.
 */
import Logic from './parts/Logic.js';
import State from './parts/StateCreator.js';
import Element from './parts/Element.js';
import polyfills from './parts/polyfills.js';
//import bystring from 'object-bystring';
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("object-bystring",[],e):"object"==typeof exports?exports["object-bystring"]=e():t["object-bystring"]=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e){Object.prototype.byString||(Object.prototype.byString=function(t,e,r){var n=r||this;t=t.toString().replace(/\[(\w+)\]/g,".$1"),t=t.toString().replace(/^\./,"");for(var o=t.split("."),i=0;i<o.length;++i){var c=o[i];if(!(c in n))return;n.hasOwnProperty(c)&&(void 0!==e&&i===o.length-1&&(n[c]=e),n=n[c])}return n})}])});

/*
Array keywords
    $ADD [Object]:
    {
        path-to-array[String] : new value to push to array
    }

    $REMOVE [Array]  --- array of strings of paths to the index of the item to remove

    when sending this to State, you must call UPDATE_STATE or you will not receive the full array back
*/


class NeState{
    constructor(obj){
        obj = obj || {};

        this.name = obj.name || console.warn('|(\'0\')|: Assign a name to this. This will help in debugging later! If you are not concerned about this, maybe you don\'t need this bulls%!t?');
        this.created= false;
        var inst = this;

        obj.stateConfig? this.State = new State(obj.stateConfig, inst) : console.error('|(\'0\')|: You have no app State. This is bulls%!t!');
        obj.logic? this.Logic = new Logic(obj.logic) : console.error('|(\'0\')|: You have no app Logic. This is bulls%!t!');
        obj.element? this.Element = new Element(obj.element) : console.error('|(\'0\')|: You have no app Elements. This is bulls%!t!');
        this.init();

    }



    init(){
        if(!this.created) {
            this.State.init();
            this.Logic.init(this);
            this.Element.init(this);
            this.created = true;
        } else {
            return console.error('|(\'0\')|: Already called init() on this bulls%!t');
        }
    }



}

export default NeState;