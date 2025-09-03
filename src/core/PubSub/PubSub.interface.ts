// Event handler type that can accept various parameter types
type EventHandler = (data: object) => void;

// Type-safe event handler (for future use)
type TypedEventHandler<T> = (payload: T) => void;

interface IEvents {
  [id: string]: EventHandler[];
}

interface IPubSub {
  events: IEvents; //Holds the events and their listeners
  on(eventName: string, fn: EventHandler): void; //Adds a listener to an event
  off(eventName: string, fn: EventHandler): void; //Removes a listener from an event
  removeAll(): void; //Removes all listeners from all events
  removeAllOf(eventName: string): void; //Removes all listeners from a specific event
  emit(eventName: string, data: object): void; //Emits an event with data
}

export type { EventHandler, TypedEventHandler, IEvents, IPubSub };
