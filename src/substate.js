import deepclone from "deep-clone-simple";
import byString from "object-bystring";

import PubSub from "./PubSub.js";

const S = "UPDATE_STATE";

export default class substate extends PubSub {
  constructor(obj = {}) {
    super();
    console.log("You are using a dev version of substate");

    this.name = obj.name || "SubStateInstance";
    this.afterUpdate = obj.afterUpdate || [];
    this.beforeUpdate = obj.beforeUpdate || [];
    this.currentState = obj.currentState || 0;
    this.stateStorage = obj.stateStorage || [];
    this.defaultDeep = obj.defaultDeep || false;

    if (obj.state) this.stateStorage.push(obj.state);
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
    this.emit(action.$type || "STATE_CHANGED", this.getCurrentState());
  }

  resetState() {
    this.currentState = 0;
    this.stateStorage = [this.stateStorage[0]];
    this.emit("STATE_RESET");
  }

  // Updates the state history array and sets the currentState pointer properly
  pushState(newState) {
    this.stateStorage.push(newState);
    this.currentState = this.stateStorage.length - 1;
    console.log("State Pushed");
  }

  updateState(action) {
    this.beforeUpdate.length > 0
      ? this.beforeUpdate.forEach(func => func(this, action))
      : null;
    let newState;
    if (action.$deep || this.defaultDeep) {
      newState = deepclone(this.getCurrentState()); // deep clonse
    } else {
      newState = Object.assign({}, this.getCurrentState()); // shallow clone
    }

    //update temp new state
    for (let key in action) {
      console.log("replacing key ", key);
      if (action.hasOwnProperty(key)) byString(newState, key, action[key]);
      //update cloned state
    }

    this.defaultDeep ? null : (newState.$deep = false); // reset $deep keyword

    console.log("New State: ", newState);
    console.log('Inside this store: ', this.name);

    if (!action.$type) newState.$type = S;

    //pushes new state
    this.pushState(newState);

    this.afterUpdate.length > 0
      ? this.afterUpdate.forEach(func => func(this))
      : null;
    this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
  }
}