/**
 * Created by root on 6/27/17.
 */
import PubSub from './PubSub.js';


export default class State extends PubSub {
    constructor(obj, inst) {
        super();
        this._inst = inst;


        if (/\s/.test(obj.name)) {
            console.warn('|(\'0\')|: Your name has spaces in it!  Please use POJO key naming conventions!');
        } else {
            this.name = obj.name || console.warn('|(\'0\')|: Please pass in a name for this PubSub instance. This will greatly help with debugging later.  If you are not concerned about this, maybe you don\'t need this bulls%!t?');

        }

        this.currentState = obj.currentState || 0;
        this.stateStorage = obj.stateStorage || [];
        this.saveOnChange = obj.saveOnChange;
        this.pullFromLocal = obj.pullFromLocal;

        obj.state ? this.stateStorage.push(obj.state) : '';
    }


    init() {
        this._inst.Logic.on('UPDATE_STATE', this.updateState.bind(this));
        this._inst.Logic.on('CHANGE_STATE', this.changeState.bind(this));
        this._inst.Logic.on('UPDATE_CHUNK', this.updateChunk.bind(this));

        if (this.pullFromLocal) {
            if (window.localStorage[this.name]) {
                var state = JSON.parse(window.localStorage.getItem(this.name));
                this.currentState = state.currentState;
                this.stateStorage = state.stateStorage;

            } else {
                console.warn('|(\'0\')|: No state of this name saved in LocalStorage.  Continuing with bulls%!t as usual.');
            }
        }
    }

    getState(index) {
        return this.stateStorage[index];
    }


    getCurrentState(){
        return this.getState(this.currentState);
    }



    getProp(prop) {
        return Object.byString(this.getCurrentState(), prop);
    }


    changeState(action) {
        this.currentState = action.requestedState;
        this.emit(action.type);
    }

    saveState() {
        var obj = {
            currentState: this.currentState,
            stateStorage: this.stateStorage,
        };

        window.localStorage.setItem(this.name, JSON.stringify(obj));
    }

    removeSavedState() {
        window.localStorage.removeItem(this.name);
    }

    clearState() {
        this.currentState = 0;
        this.stateStorage = [this.stateStorage[0]];
        this.emit('STATE_RESET');
    }


    updateChunk(action){//DOESNT WORK
        var newChunk = {};
        var newState = Object.assign({}, this.getCurrentState());//clone state
        
        //
        //update temp new state
        for (var key in action) {
            if(action.hasOwnProperty(key)){
                console.log('key value: ',action[key]);
                newState.byString(key, action[key]);//update cloned state
                newChunk[key]= action[key];//create chunk
                console.log(newChunk)
                //**NOTE: 01-AA** this is a performance cheat.  I'm not retrieving current state.  
                //...I'm building the chunk from the passed in action this avoids another
                //...loop to build the chunk from the current state
                //...this assumption is that the state update will be successful and that
                //...there is no altered data from here until the next call of 
                //...'UPDATE_STATE' or 'UPDATE_CHUNK'
            }
        }
 
        //
        //update currentState index to last state
        if (this.currentState != this.stateStorage.length - 1) {
            this.currentState = this.stateStorage.length - 1;
        }
        ++this.currentState;//update

        //
        //push new state to array
        this.stateStorage.push(newState);//push cloned state to stateStorage

        // //
        // //retrieve only chunk
        //**NOTE: State: 01-AB** this is the legit way to do it.  See note 01-AA
        // for (var key in action) {
        //     if(action.hasOwnProperty(key)){
        //         console.log('key value: ',action[key]);
        //         newChunk[this.getProp(key)] = action[key];//create chunk
        //     }
        // }

        
        console.log(newChunk);
        this.emit(action.type, newChunk);//emit with latest data
        
        this.saveOnChange ? this.saveState() : '';
    }

    updateState(action) {
        var newState = Object.assign({}, this.getCurrentState());//clone state
        console.log('in newState: ', action)

        //
        //update temp new state
        for (var key in action) {
            if(action.hasOwnProperty(key)){
                console.log('key value: ',action[key]);
                // switch (action[key]){
                //     case '$REMOVE'://special keyword to remove from an array
                //     console.log('State...action[key]: ',action[key]);
                //         var st = key.split('.');//resplit string
                //         console.log('State... st: ', st);
                        
                //         var nk = st.pop();//remove and store end (we assume you made en the index)
                //         console.log('State... nk: ', nk);
                //         var arr = Object.byString(newState, st.join('.'));//find the array 
                //         console.log('State... arr: ', arr);
                //         arr = arr.splice(nk, 1);//remove from array
                //         console.log('State... arr after splice: ', arr);
                        
                //         break;
                //     case /^$ADD/i://special keyword to add to array
                //         console.log('State...action[key]: ',action[key]);
                //         console.log(action);
                //         var st = key.split('.');//resplit string
                //         console.log('State... st: ', st);
                        
                //         var nk = st.pop();//remove and store end (we assume you made en the index)
                //         console.log('State... nk: ', nk);
                //         var arr = Object.byString(newState, st.join('.'));//find the array 
                //         console.log('State... arr: ', arr);
                //         arr.push(nk);

                //         break;

                switch (key){
                    case '$REMOVE':
                        action[key].forEach(function(cv, ci){
                            console.log(cv);
                            var st = cv.split('.');//resplit string 
                            var nk = st.pop();//remove and store end (we assume you made en the index)
                            var arr = Object.byString(st.join('.'), newState);//find the array
                            arr = arr.splice(nk, 1);//remove from array
                        });
                    break;
                    case '$ADD': 
                        for(var k in action[key]){//loop through object
                            if(action[key].hasOwnProperty(k)){
                                var arr = Object.byString(k.toString(), newState);//find array to push to
                                arr.push(action[key][k]);//push value to it.
                            }
                        }
                    break;
                        
                default:
                    Object.byString(newState, key, action[key]);//update cloned state
                }
            }
        }
               
         

        //
        //update currentState index to last state
        if (this.currentState != this.stateStorage.length - 1) {
            this.currentState = this.stateStorage.length - 1;
        }
        console.log('new state before push: ', newState);
        this.stateStorage.push(newState);//push cloned state to stateStorage
        ++this.currentState;//update

        this.emit(action.type, this.getCurrentState());//emit with latest data
        
        this.saveOnChange ? this.saveState() : '';


    }
}