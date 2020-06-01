import PubSub from "./PubSub";
interface IAction {
  $type?: string;
  $deep?: boolean;
  [key: string]: any;
}
interface IConfig {
  name?: string;
  afterUpdate?: Function[] | [];
  beforeUpdate?: Function[] | [];
  currentState?: number;
  stateStorage?: object[];
  defaultDeep?: boolean;
  state?: object;
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
  constructor(obj: IConfig);
  getState(index: number): {};
  getCurrentState(): {};
  getProp(prop: string): any;
  changeState(action: IChangeStateAction): void;
  resetState(): void;
  pushState(newState: Object): void;
  updateState(action: IAction): void;
}
export {};
//# sourceMappingURL=index.d.ts.map
