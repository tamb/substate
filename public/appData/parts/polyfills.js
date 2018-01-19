/**
 * Created by root on 6/27/17.
 */
//object assign
export default (function(){

    if (typeof Object.assign != 'function') {
        Object.assign = function(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };
    }


    //
    //writing a string to access nested object
    // Object.byString = function(o, s) {
    //     s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    //     s = s.replace(/^\./, '');           // strip a leading dot
    //     var a = s.split('.');
    //     for (var i = 0, n = a.length; i < n; ++i) {
    //         var k = a[i];
    //         if (k in o) {
    //             o = o[k];
    //         } else {
    //             return;
    //         }
    //     }
    //     return o;
    // }

    //
    //NEW byString which can update values
//    Object.byString = function(o, s, v) {
//        s = s.replace(/\[(\w+)\]/g, '.$1'); // CONVERT INDEXES TO PROPERTIES
//        s = s.replace(/^\./, ''); // STRIP A LEADING DOT
//        var a = s.split('.'); //ARRAY OF STRINGS SPLIT BY '.'
//        for (var i = 0; i < a.length; ++i) {//LOOP OVER ARRAY OF STRINGS
//            var k = a[i];
//            if (k in o) {//LOOP THROUGH OBJECT KEYS
//                if(o.hasOwnProperty(k)){//USE ONLY KEYS WE CREATED
//                  if(v !== undefined){//IF WE HAVE A NEW VALUE PARAM
//                    if(i === a.length -1){//IF IT'S THE LAST IN THE ARRAY
//                      o[k] = v;
//                    }
//                  }
//                  o = o[k];//NO NEW VALUE SO JUST RETURN THE CURRENT VALUE
//                }
//            } else {
//                return;
//            }
//        }
//        return o;
//    }

})();