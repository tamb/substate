/**
 * Created by root on 6/27/17.
 */
interface IEvents {
  [id: string]: Function[];
}
export default class PubSub {
  events: IEvents;
  constructor();
  on(eventName: string, fn: Function): void;
  off(eventName: string, fn: Function): void;
  emit(eventName: string, data?: object): void;
}
export {};
