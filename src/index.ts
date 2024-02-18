import cloneDeep from "clone-deep";
import byString from "object-bystring";

import PubSub, { IPubSub } from "./PubSub";

const S: string = "UPDATE_STATE";

interface IState {
  [key: string]: any;
  $type?: string;
  $deep?: boolean;
}

export interface ISubstate extends IPubSub {
  name: string;
  afterUpdate: Function[] | [];
  beforeUpdate: Function[] | [];
  currentState: number;
  stateStorage: IState[];
  defaultDeep: boolean;
  getState(index: number): {};
  getCurrentState(): IState;
  getProp(prop: string): any;
  resetState(): void;
  updateState(action: IState): void;
}

export interface IConfig {
  name?: string;
  afterUpdate?: Function[] | [];
  beforeUpdate?: Function[] | [];
  currentState?: number;
  stateStorage?: object[];
  defaultDeep?: boolean;
  state?: object;
}

export interface IChangeStateAction extends IState {
  $requestedState: number;
}

export default class Substate extends PubSub implements ISubstate {
  name: string;
  afterUpdate: Function[] | [];
  beforeUpdate: Function[] | [];
  currentState: number;
  stateStorage: object[];
  defaultDeep: boolean;

  constructor(obj: IConfig = {}) {
    super();

    this.name = obj.name || "SubStateInstance";
    this.afterUpdate = obj.afterUpdate || [];
    this.beforeUpdate = obj.beforeUpdate || [];
    this.currentState = obj.currentState || 0;
    this.stateStorage = obj.stateStorage || [];
    this.defaultDeep = obj.defaultDeep || false;

    if (obj.state) this.stateStorage.push(obj.state);
    this.on(S, this.updateState.bind(this));
  }

  public getState(index: number): {} {
    return this.stateStorage[index];
  }

  public getCurrentState(): {} {
    return this.getState(this.currentState);
  }

  public getProp(prop: string): any {
    return byString(this.getCurrentState(), prop);
  }

  public resetState() {
    this.currentState = 0;
    this.stateStorage = [this.stateStorage[0]];
    this.emit("STATE_RESET");
  }

  // Updates the state history array and sets the currentState pointer properly
  private pushState(newState: Object) {
    this.stateStorage.push(newState);
    this.currentState = this.stateStorage.length - 1;
  }

  private cloneState(deep: boolean): IState {
    return deep
      ? cloneDeep(this.getCurrentState())
      : Object.assign({}, this.getCurrentState());
  }

  private fireBeforeMiddleware(action: IState): void {
    this.beforeUpdate.length > 0
      ? this.beforeUpdate.forEach((func) => func(this, action))
      : null;
  }

  private fireAfterMiddleware(action: IState): void {
    this.afterUpdate.length > 0
      ? this.afterUpdate.forEach((func) => func(this, action))
      : null;
  }

  public updateState(action: IState): void {
    this.fireBeforeMiddleware(action);
    const deep: boolean =
      action.$deep !== undefined ? action.$deep : this.defaultDeep;
    const newState = this.cloneState(deep);

    //update temp new state
    for (let key in action) {
      byString(newState, key, action[key]);
      //update cloned state
    }

    this.defaultDeep ? null : (newState.$deep = false); // reset $deep keyword
    newState.$type = action.$type || S; // set $type if not already set

    //pushes new state
    this.pushState(newState);
    this.fireAfterMiddleware(action);
    this.emit(action.$type || "STATE_UPDATED", this.getCurrentState()); //emit with latest data
  }
}
