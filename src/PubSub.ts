/**
 * Created by root on 6/27/17.
 */

interface IEvents {
  [id: string]: Function[];
}

export interface IPubSub {
  events: IEvents;
  on(eventName: string, fn: Function): void;
  off(eventName: string, fn: Function): void;
  removeAll(): void;
  removeAllOf(eventName: string): void;
  emit(eventName: string, data: object): void;
}

export default class PubSub implements IPubSub {
  events: IEvents;

  constructor() {
    this.events = {};
  }

  on(eventName: string, fn: Function) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName: string, fn: Function) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  removeAll() {
    this.events = {};
  }

  removeAllOf(eventName: string) {
    this.events[eventName] = [];
  }

  emit(eventName: string, data: object = {}) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  }
}
