import type { EventHandler, IEvents, IPubSub } from './PubSub.interface';

class PubSub implements IPubSub {
  events: IEvents;

  constructor() {
    this.events = Object.create(null); // Slightly faster than {}
  }

  on(eventName: string, fn: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  off(eventName: string, fn: EventHandler) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
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
    const handlers = this.events[eventName];
    if (handlers) {
      for (let i = 0; i < handlers.length; i++) {
        handlers[i](data);
      }
    }
  }
}

export { type EventHandler, type IPubSub, PubSub };
