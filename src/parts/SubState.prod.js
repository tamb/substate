/**
 * Created by root on 6/27/17.
 */
import PubSub from './PubSub.js';
import bystring from 'object-bystring';


export default class SubState extends PubSub {
    constructor(obj, inst) {
        super();

        var obj = obj || {}

        this.name = obj.name || "SubStateInstance";



        this.currentState = obj.currentState || 0;
        this.stateStorage = obj.stateStorage || [];
        this.saveOnChange = obj.saveOnChange || null;
        this.pullFromLocal = obj.pullFromLocal || null;

        obj.state ? this.stateStorage.push(obj.state) : null;
    }


    init() {
        this.on('UPDATE_STATE', this.updateState.bind(this));
        this.on('CHANGE_STATE', this.changeState.bind(this));
        this.on('UPDATE_CHUNK', this.updateChunk.bind(this));

        if (this.pullFromLocal) {
            if (window.localStorage[this.name]) {
                var state = JSON.parse(window.localStorage.getItem(this.name));
                this.currentState = state.currentState;
                this.stateStorage = state.stateStorage;

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
        //TODO does not work need to rewrite since object.bystring is rewritten
        return Object.byString(this.getCurrentState(), prop);
    }


    changeState(action) {
        this.currentState = action.requestedState;
        this.emit((action.type || 'STATE_CHANGED'), this.getCurrentState());
    }

    saveState() {
        var obj = {
            currentState: this.currentState,
            stateStorage: this.stateStorage,
        };

        window.localStorage.setItem(this.name, JSON.stringify(obj));
        this.emit('STATE_SAVED');
    }

    removeSavedState() {
        window.localStorage.removeItem(this.name);
        this.emit('STATE_REMOVED_SAVED_STATE');
    }

    resetState() {
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
//                console.log('key value: ',action[key]);
                newState.byString(key, action[key]);//update cloned state
                newChunk[key]= action[key];//create chunk
//                console.log(newChunk)
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



        this.emit((action.type || 'CHUNK_UPDATED'), newChunk);//emit with latest data

        this.saveOnChange ? this.saveState() : '';
    }

    updateState(action) {

        console.log('here', action)

        var newState = Object.assign({}, this.getCurrentState());//clone state

        //
        //update temp new state
        for (var key in action) {
            if(action.hasOwnProperty(key)){



                switch (key){
                    case '$REMOVE':
                        action[key].forEach(function(cv, ci){

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
                    newState.byString(key, action[key]);//update cloned state
                }
            }
        }



        //
        //update currentState index to last state
        if (this.currentState != this.stateStorage.length - 1) {
            this.currentState = this.stateStorage.length - 1;
        }
        this.stateStorage.push(newState);//push cloned state to stateStorage
        ++this.currentState;//update

        this.emit((action.type || 'STATE_UPDATED'), this.getCurrentState());//emit with latest data

        this.saveOnChange ? this.saveState() : '';


    }
}