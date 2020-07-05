const deepclone = require("deep-clone-simple");
import byString from "object-bystring";

/*START.DEV*/
import { updatedDiff } from "deep-object-diff";
import Stacktrace from "stacktrace-js";
/*END.DEV*/

import PubSub from "./PubSub";

const S: string = "UPDATE_STATE";
const C: string = "CHANGE_STATE";

interface IAction {
  $type?: string;
  $deep?: boolean;
  [key: string]: any;
}

/*START.DEV*/
interface IDebug {
  actions?: boolean;
  emits?: boolean; //all emit types
  emitWithData?: boolean; // same but with all data
  previousState?: boolean; // on all updates show previous state
  newState?: boolean; // on all updates show the new state
  diffState?: boolean; // on update show only the updated fields
}
/*END.DEV*/

interface IConfig {
  name?: string;
  afterUpdate?: Function[] | [];
  beforeUpdate?: Function[] | [];
  currentState?: number;
  stateStorage?: object[];
  defaultDeep?: boolean;
  state?: object;
  /*START.DEV*/
  debug?: IDebug;
  /*END.DEV*/
}

interface IChangeStateAction extends IAction {
  $requestedState: number;
}

export default class substate extends PubSub {
  name: string;
  afterUpdate: Function[] | [];
  beforeUpdate: Function[] | [];
  currentState: number;
  stateStorage: object[];
  defaultDeep: boolean;

  constructor(obj: IConfig = {}) {
    super();
    /*START.DEV*/
    console.warn("[substate] - You are using a dev version of substate");
    /*END.DEV*/

    this.name = obj.name || "SubStateInstance";
    this.afterUpdate = obj.afterUpdate || [];
    this.beforeUpdate = obj.beforeUpdate || [];
    this.currentState = obj.currentState || 0;
    this.stateStorage = obj.stateStorage || [];
    this.defaultDeep = obj.defaultDeep || false;

    if (obj.state) this.stateStorage.push(obj.state);
    this.on(S, this.updateState.bind(this));
    this.on(C, this.changeState.bind(this));
  }

  getState(index: number): {} {
    return this.stateStorage[index];
  }

  getCurrentState(): {} {
    return this.getState(this.currentState);
  }

  getProp(prop: string): any {
    return byString(this.getCurrentState(), prop);
  }

  changeState(action: IChangeStateAction) {
    this.currentState = action.$requestedState;
    this.emit(action.$type || "STATE_CHANGED", this.getCurrentState());
  }

  resetState() {
    this.currentState = 0;
    this.stateStorage = [this.stateStorage[0]];
    this.emit("STATE_RESET");
  }

  // Updates the state history array and sets the currentState pointer properly
  pushState(newState: Object) {
    this.stateStorage.push(newState);
    this.currentState = this.stateStorage.length - 1;
  }

  updateState(action: IAction) {
    this.beforeUpdate.length > 0
      ? this.beforeUpdate.forEach((func) => func(this, action))
      : null;
    let newState;
    if (action.$deep || this.defaultDeep) {
      newState = deepclone(this.getCurrentState()); // deep clonse
    } else {
      newState = Object.assign({}, this.getCurrentState()); // shallow clone
    }

    //update temp new state
    for (let key in action) {
      if (action.hasOwnProperty(key)) byString(newState, key, action[key]);
      //update cloned state
    }

    this.defaultDeep ? null : (newState.$deep = false); // reset $deep keyword

    if (!action.$type) newState.$type = S;

    /*START.DEV*/
    console.info(
      Stacktrace.getSync()[3].functionName,
      " emits ",
      newState.$type,
      "with new data: ",
      updatedDiff(this.getCurrentState(), newState)
    );
    /*END.DEV*/

    //pushes new state
    this.pushState(newState);

    this.afterUpdate.length > 0
      ? this.afterUpdate.forEach((func) => func(this))
      : null;
    this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
  }
}
