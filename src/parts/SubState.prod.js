if (typeof Object.assign != 'function') {
    Object.assign = function(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) throw new TypeError('Cannot convert undefined or null to object');
        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) to[nextKey] = nextSource[nextKey];
                        
                    
                }
            }
        }
        return to;
    };
}

import bystring from 'object-bystring';
import PubSub from './PubSub.js';



export default class SubState extends PubSub {
    constructor(objParam, inst) {
        super();
        console.warn(`

        "Yoooo. You are using a Development version of SubState (npm substate, etc.).
        Please run UglifyJS/similar for production mode (to remove comments, and console.logs
        You can run UglifyJS/similar with options similar to
        ~~~~~new webpack.optimize.UglifyJsPlugin({ //plugin that minifies js
                comments: true,// Eliminate comments
                compress: {
                    warnings: false, //remove warnings
                    drop_console: true //remove console.logs
                },
                sourceMap: !bool //generate a source map for each minified file
             })~~~~~"
    /( '0')/
        `);

        const $obj = objParam || {}

        this.$name = $obj.name || "SubStateInstance";
        this.$loaded = false;

        this.$currentState = $obj.currentState || 0;
        this.$stateStorage = $obj.stateStorage || [];
        this.$saveOnChange = $obj.saveOnChange || null;
        this.$pullFromLocal = $obj.pullFromLocal || null;

        if ($obj.state) this.$stateStorage.push($obj.state);
        this.$init();
        this.$getCurrentState = this.$getCurrentState.bind(this);
    }

    $init() {
      if (!this.$loaded){
        this.$on('UPDATE_STATE', this.$updateState.bind(this));
        this.$on('CHANGE_STATE', this.$changeState.bind(this));
        this.$on('UPDATE_CHUNK', this.$updateChunk.bind(this));

        if (this.pullFromLocal) {
            if (window.localStorage[this.name]) {
                const state = JSON.parse(window.localStorage.getItem(this.name));
                this.$currentState = state.currentState;
                this.$stateStorage = state.stateStorage;
            }
        }
        this.$loaded = true;
      }
    }

    $getState(index) {
        return this.$stateStorage[index];
    }

    $getCurrentState(s) {
        console.log('getting current state from this>> ', this, s);
        return this.$getState(this.$currentState);
    }

    $getProp(prop) {
        //TODO does not work need to rewrite since object.bystring is rewritten
        return this.$getCurrentState().byString(prop);
    }

    $changeState(action) {
        this.$currentState = action.requestedState;
        this.$emit((action.$type || 'STATE_CHANGED'), this.$getCurrentState());
    }

    $saveState() {
        const obj = {
            currentState: this.$currentState,
            stateStorage: this.$stateStorage,
        };

        window.localStorage.setItem(this.$name, JSON.stringify(obj));
        this.$emit('STATE_SAVED');
    }

    $removeSavedState() {
        window.localStorage.removeItem(this.name);
        this.$emit('STATE_REMOVED_SAVED_STATE');
    }

    $resetState() {
        this.$currentState = 0;
        this.$stateStorage = [this.$stateStorage[0]];
        this.$emit('STATE_RESET');
    }

    // Updates the state history array and sets the currentState pointer properly
    $pushState(newState) {
      this.$stateStorage = this.$stateStorage.concat(newState);
      this.$currentState = (this.$stateStorage.length -1);
    }

    $updateChunk(action) {//DOESNT WORK
        const newChunk = {};
        const newState = Object.assign({}, this.$getCurrentState());//clone state

        //update temp new state
        for (let key in action) {
            if (action.hasOwnProperty(key)) {
                newState.byString(key, action[key]);//update cloned state
                newChunk[key] = action[key];//create chunk

                //**NOTE: 01-AA** this is a performance cheat.  I'm not retrieving current state.
                //...I'm building the chunk from the passed in action this avoids another
                //...loop to build the chunk from the current state
                //...this assumption is that the state update will be successful and that
                //...there is no altered data from here until the next call of
                //...'UPDATE_STATE' or 'UPDATE_CHUNK'
            }
        }
        
        if(!action.$type) newState.$type = 'UPDATE_CHUNK';

        //pushes new state
        this.$pushState(newState);

        // //retrieve only chunk
        //**NOTE: State: 01-AB** this is the legit way to do it.  See note 01-AA
        // for (var key in action) {
        //     if(action.hasOwnProperty(key)){
        //         console.log('key value: ',action[key]);
        //         newChunk[this.getProp(key)] = action[key];//create chunk
        //     }
        // }

        this.$emit((action.$type || 'CHUNK_UPDATED'), newChunk);//emit with latest data

        if (this.$saveOnChange) this.$saveState();
    }

    $updateState(action) {
        const newState = Object.assign({}, this.$getCurrentState());//clone state

        //update temp new state
        for (let key in action) {
            if (action.hasOwnProperty(key)) newState.byString(key, action[key]);
             //update cloned state
        }

        console.log('new State: ', newState);

        if(!action.$type) newState.$type = 'UPDATE_STATE'; 

        //pushes new state
        this.$pushState(newState);

        this.$emit((action.$type || 'STATE_UPDATED'), this.$getCurrentState());//emit with latest data
        console.log('Current State: ', this.$getCurrentState());

        if (this.$saveOnChange) this.$saveState();
    }
}
