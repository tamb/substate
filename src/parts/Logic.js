/**
 * Created by root on 6/27/17.
 */

/*
* @obj --- config object for Logic
*
* @obj.segment --- section of the state object to work on??
*
//* obj.logic ---- arr of objects.  >> each with:
// *      cases: actionFromElement.types [Array of Strings]
//*       callbacks: [Array of Functions]
//*
//*/

//{
//    pubSubName: 'String'
//    appLogic: [Func]'which contains all business logic'
//}



import PubSub from './PubSub.js';

export default class Logic extends PubSub{
    constructor(obj){
    	super();
    	
        if(/\s/.test(obj.name)){
            console.warn('|(\'0\')|: Your name has spaces in it!  Please use POJO key nameing conventions!'); 
        } else {
            this.name = obj.name || console.warn('|(\'0\')|: Please pass in a name for this PubSub instance. This will greatly help with debugging later.  If you are not concerned about this, maybe you don\'t need this bulls%!t?');
       
        }
        this.init = obj.init || console.warn('|(\'0\')|: There is not init for your logic.executions config!  Maybe you don\'t need this bullshit?');
    }
}





//GARBAGE




//this.segment = obj.segment || null;
//if (obj.logic) {
//
//    if (typeof obj.logic == Array ) {
//
//        this.run = function (actionFromElement) {
//
//            obj.logic.forEach(function (currentValue, currentIndex, currentArray) {//
//                currentValue.cases.forEach(function (cV, cI, cA) {
//                    if (cV === actionFromElement.type){
//                        currentValue.callbacks.forEach(function(cVFunc, cIFunc, c){
//
//                        });
//                    }
//                });
//            });
//
//        }
//
//    } else {
//
//        return console.error('obj.logic must be of type Array');
//    }
//
//} else {
//
//    return console.error('You need to add a config.logic array')
//
////}