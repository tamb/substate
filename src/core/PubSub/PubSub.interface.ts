// Event handler type that can accept various parameter types
// biome-ignore lint/suspicious/noExplicitAny: Event handlers need flexibility for different parameter types
type EventHandler = (...args: any[]) => void

interface IEvents {
  [id: string]: EventHandler[]
}

interface IPubSub {
  events: IEvents //Holds the events and their listeners
  on(eventName: string, fn: EventHandler): void //Adds a listener to an event
  off(eventName: string, fn: EventHandler): void //Removes a listener from an event
  removeAll(): void //Removes all listeners from all events
  removeAllOf(eventName: string): void //Removes all listeners from a specific event
  emit(eventName: string, data: object): void //Emits an event with data
}

export type { EventHandler, IEvents, IPubSub }
