import type { EventHandler, IEvents, IPubSub } from './PubSub.interface'

class PubSub implements IPubSub {
  events: IEvents

  constructor() {
    this.events = {}
  }

  on(eventName: string, fn: EventHandler) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)
  }

  off(eventName: string, fn: EventHandler) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1)
          break
        }
      }
    }
  }

  removeAll() {
    this.events = {}
  }

  removeAllOf(eventName: string) {
    this.events[eventName] = []
  }

  emit(eventName: string, data: object = {}) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => {
        fn(data)
      })
    }
  }
}

export { type EventHandler, type IPubSub, PubSub }
