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
    const handlers = this.events[eventName];
    if (handlers) {
      // Optimized removal using indexOf and splice
      const index = handlers.indexOf(fn);
      if (index > -1) {
        handlers.splice(index, 1);
        // Clean up empty arrays to prevent memory leaks
        if (handlers.length === 0) {
          delete this.events[eventName];
        }
      }
    }
  }

  removeAll() {
    this.events = Object.create(null); // Faster than {}
  }

  removeAllOf(eventName: string) {
    this.events[eventName] = [];
  }

  emit(eventName: string, data: object = {}) {
    const handlers = this.events[eventName];
    if (handlers && handlers.length > 0) {
      // Use for...of for better performance with modern engines
      for (const handler of handlers) {
        handler(data);
      }
    }
  }
}

export { type EventHandler, type IPubSub, PubSub };
