(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('deep-clone-simple'), require('object-bystring')) :
    typeof define === 'function' && define.amd ? define(['exports', 'deep-clone-simple', 'object-bystring'], factory) :
    (global = global || self, factory(global.substate = {}, global.deepclone, global.byString));
}(this, function (exports, deepclone, byString) { 'use strict';

    deepclone = deepclone && deepclone.hasOwnProperty('default') ? deepclone['default'] : deepclone;
    byString = byString && byString.hasOwnProperty('default') ? byString['default'] : byString;

    /**
     * Created by root on 6/27/17.
     */
    class PubSub{
        constructor(){
            this.events = {};

        }

        on(eventName, fn){

            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(fn);

        }

        off(eventName, fn) {
            if (this.events[eventName]) {
                for (var i = 0; i < this.events[eventName].length; i++) {
                    if (this.events[eventName][i] === fn) {
                        this.events[eventName].splice(i, 1);
                        break;
                    }
                }
            }
        }

        emit(eventName, data) {
            console.log('in emit: ', data);
            if (this.events[eventName]) {
                this.events[eventName].forEach(function(fn, i) {
                    console.log(i, eventName, data);
                    fn(data);
                });
            }
        }

    }

    const S = 'UPDATE_STATE';

    class substate extends PubSub {
        constructor(obj= {}) {
            super();
            console.log(`
        "Yoooo. You are using a Development version of SubState (npm substate, etc.).
    /( '0')/
        `);


            this.name = obj.name || "SubStateInstance";
            this.afterUpdate = obj.afterUpdate || [];
            this.beforeUpdate = obj.beforeUpdate || [];
            this.currentState = obj.currentState || 0;
            this.stateStorage = obj.stateStorage || [];
            this.defaultDeep = obj.defaultDeep || false;

            if (obj.state) this.stateStorage.push(obj.state);
            this.init();
       
        }

        init() {
            this.on(S, this.updateState.bind(this));
        }

        getState(index) {
            return this.stateStorage[index];
        }

        getCurrentState(s) {
            return this.getState(this.currentState);
        }

        getProp(prop) {
            return byString(this.getCurrentState(), prop);
        }

        changeState(action) {
            this.currentState = action.requestedState;
            this.emit((action.$type || 'STATE_CHANGED'), this.getCurrentState());
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
            this.beforeUpdate.length > 0? this.beforeUpdate.forEach(func => func(this, action)) : null;
            let newState;
            if (action.$deep || this.defaultDeep){
                newState = deepclone(this.getCurrentState());// deep clonse
            } else {
                newState = Object.assign({}, this.getCurrentState()); // shallow clone
            }        

            //update temp new state
            for (let key in action) {
                console.log('replacing key ', key);
                if (action.hasOwnProperty(key)) byString(newState, key, action[key]);
                 //update cloned state
            }

            this.defaultDeep? null : newState.$deep = false; // reset $deep keyword

            console.log('New State: ', newState);

            if(!action.$type) newState.$type = S; 

            //pushes new state
            this.pushState(newState);

            this.afterUpdate.length > 0? this.afterUpdate.forEach(func => func(this)) : null;
            this.emit((action.$type || 'STATE_UPDATED'), this.getCurrentState());//emit with latest data
        }
    }


    // TODO - middleware should merge and should be an array
    function mergeStores(stores, opt = {}) {
        let newState = {};
        let newEvents = {};
        let newDefaultDeep = false;
        let beforeUpdate = [];
        let afterUpdate = [];
        stores.forEach(store => {
          newState = Object.assign(store.getCurrentState() || {}, newState);
            for (let key in store.events){
                if(newEvents[key]){
                    newEvents[key] = store.events[key].concat(newEvents[key]);
                } else {
                    newEvents[key] = store.events[key].slice(0);
                }
            }
          if (store.defaultDeep) {
            newDefaultDeep = true;
          }
          newEvents.UPDATE_STATE = newEvents.UPDATE_STATE.slice(stores.length -1);
          beforeUpdate = store.beforeUpdate.concat(beforeUpdate);
          afterUpdate = store.afterUpdate.concat(afterUpdate);
        });
      
        opt.state = newState;
        opt.defaultDeep = opt.defaultDeep || newDefaultDeep;
        opt.afterUpdate = afterUpdate;
        opt.beforeUpdate = beforeUpdate;
        const newStore = new substate(opt);
        console.log('new store BEFORE merge');
        console.table(newStore);
        console.table(opt);
      
        newStore.events = Object.assign(newStore.events, newEvents);
      
        return newStore;
      }

    exports.mergeStores = mergeStores;
    exports.substate = substate;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
