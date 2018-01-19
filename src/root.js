/**
 * Created by root on 6/27/17.
 */
import Logic from './parts/Logic.js';
import State from './parts/StateCreator.js';
import Element from './parts/Element.js';
import polyfills from './parts/polyfills.js';
import bystring from 'object-bystring';

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
        obj.elements? this.Element = new Element(obj.elements) : console.error('|(\'0\')|: You have no app Elements. This is bulls%!t!');
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