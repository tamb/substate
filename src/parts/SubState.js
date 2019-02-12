import cloneDeep from 'lodash.clonedeep';
import 'object-bystring';

import PubSub from './PubSub.js';

const S = 'UPDATE_STATE';
const C = 'UPDATE_CHUNK';


export default class SubState extends PubSub {
    constructor(objParam, inst) {
        super();
        console.warn(`
        "Yoooo. You are using a Development version of SubState (npm substate, etc.).
    /( '0')/
        `);

        const obj = objParam || {};

        this.name = obj.name || "SubStateInstance";

        this.currentState = obj.currentState || 0;
        this.stateStorage = obj.stateStorage || [];
        this.defaultDeep = obj.defaultDeep || false;

        if (obj.state) this.stateStorage.push(obj.state);
        this.init();
   
    }

    init() {
        this.on(S, this.updateState.bind(this));
        this.on(C, this.updateChunk.bind(this));

        if (this.pullFromLocal) {
            if (window.localStorage[this.name]) {
                const state = JSON.parse(window.localStorage.getItem(this.name));
                this.currentState = state.currentState;
                this.stateStorage = state.stateStorage;
                this.emit('PULLED_FROM_LOCAL');
            }
        }
    }

    getState(index) {
        return this.stateStorage[index];
    }

    getCurrentState(s) {
        return this.getState(this.currentState);
    }

    getProp(prop) {
        //TODO does not work need to rewrite since object.bystring is rewritten
        return this.getCurrentState().byString(prop);
    }

    changeState(action) {
        this.currentState = action.requestedState;
        this.emit((action.$type || 'STATE_CHANGED'), this.getCurrentState());
    }

    saveState() {
        const obj = {
            currentState: this.currentState,
            stateStorage: this.stateStorage,
        };

        window.localStorage.setItem(this.name, JSON.stringify(obj));
        this.emit('STATE_SAVED', this.getCurrentState());
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

    // Updates the state history array and sets the currentState pointer properly
    pushState(newState) {
      this.stateStorage.push(newState);
      this.currentState = (this.stateStorage.length -1);
      console.log('State Pushed');
    }

    updateState(action) {
        let newState;
        if (actions.$deep || this.defaultDeep){
            newState = cloneDeep(this.getCurrentState());// deep clonse
        } else {
            newState = Object.assign({}, this.getCurrentState()); // shallow clone
        }        

        //update temp new state
        for (let key in action) {
            console.log('replacing key ', key);
            if (action.hasOwnProperty(key)) newState.byString(key, action[key]);
             //update cloned state
        }

        newState.$deep = false; // reset $deep keyword

        console.log('New State: ', newState);

        if(!action.$type) newState.$type = S; 

        //pushes new state
        this.pushState(newState);
        
        this.emit((action.$type || 'STATE_UPDATED'), this.getCurrentState());//emit with latest data
        
        if (this.saveOnChange) this.saveState();
    }
}