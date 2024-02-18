# ⛱️ substate

## Automatically clone or deep clone your state

## The Problem

Most state management libraries don't clone your state for you.  
Most don't optionally deep clone your state.
Most don't offer an entire messaging system either.
Most don't come as a 2kb gzipped package.
This one does.

## Purpose

- To manage state with a simple pub/sub pattern
- To improve upon the pub/sub with unidirectional data flow
- For State to return a new state (pure function)
- Message filtering can be applied _without_ a `switch` statement (you create your own event `$type`)
- To allow for manipulation of deeply nested state properties through use of strings `{'my[index]deeply.nests.state': 'new value'}` (we're sending this to substate to _not mutate_ the state, but make a new copy (Flux-y)!
- Maintain a small size

## Terms

### store

The `store` is the substate instance. It has methods and state storage. It basically handles all your changes for you and acts as a mediator between different parts of your application. It's really a simple pub/sub pattern with data in it. That's all.

```js
store - "I'll handle this!"
  ___________________
 |                   |
 | message queues    |
 | application state |
 |___________________|
```

### emit

A method that shoots a `$type` and `payload` to the `store`.
This method tells the `store`:
"Hey store. I need you to send this message `$type` out. And here's a `payload` of data to send with it!"

```js
store.emit($type, payload);
```

### on

A method that listens for the above `$type` and fires a callback function that gets passed the `emit` methods `payload`
"Hello store. When you send out a message of this `$type`, please fire this `callbackFunction` and pass it your `payload`! Thanks!"

```js
store.on($type, callbackFunction);
```

### off

A method that stops a certain `callbackFunction` on a specific `$type`
"Howdy store. When you send out a message of this `$type`, you don't need to fire this `callbackFunction`. Please remove the function from your queue."

```js
store.off($type, callbackFunction);
```

### payload

An object of data. You can put any data in there that you want. The idea is that you would put your updated `state` object in there. The `store` will save your old state and `emit` your make updates to your new state according to this object. When triggering a state change with `UPDATE_STATE` you have the option of passing 2 fields into your `payload`

- `$type` - this is a String value of a message `$type` that the `store` will `emit`. So if you pass it `$type: "SAY_HI"`, the `store` will emit `store.emit("SAY_HI", data)` and any callbacks that have been registered with `store.on("SAY_HI", callback)` will be fired _in registration order_.
- `$deep` - this is a boolean that, when set to `true` will deep clone your state object. In the guts of the store we use `Object.assign`, which does not deep clone the state object. But the store has a special trick that can deep clone for you. So that means you don't have to normalize your state. You can have it as nested and complicated as you want. This is a huge plus for people who want their state to reflect their complex dataset.

## How it Works

### The Steps

1. (if using modules)

```js
//store.js
import Substate from "substate";

export const store = new Substate({
  name: "storeExample",
  defaultDeep: true,
  afterUpdate: [myMiddleware],
  beforeUpdate: [myBeforeMiddleware],
  state: {
    todos: [],
  },
});

// MyComponent.js
import { store } from "./store.js";
```

2. Components will register one or more methods to rerender themselves using your instance (see [instantiation](#instantiation))
   using `myInstance.on('STATE_UPDATED', rerender)` per method
   You can register to a custom event as well

```js
// MyComponent.js

// default state event
store.on("STATE_UPDATED", rerenderFunction);

// custom state event
store.on("HEIGHT_CHANGE", rerenderFunction);
```

3. Components take UI event ("click", "focus", etc) and pass it off to a Handler/Reducer

```js
// MyComponent.js
element.addEventListener("click", clickHandler);
```

4. The Handler/Reducer figures out what should change in the state (it does not update the state directly). It also figures out if/what `$type` should be sent to the Pub/Sub module

```js
// MyComponent.js

clickHandler = () => {
  // define which fields should be updated and to what values
  // you can use string notation because of the underlying technology in substate!

  const newState = {
    name: "Pablo",
    "height.inches": 62,
    "height.centimeters": 157.48,
    //$type: "HEIGHT_CHANGE", -- tells the store to emit a custom event when the state is updated
    //$deep: true, -- tells the store to deep clone the state
  };

  store.updateState(newState);
  // OR use the UPDATE_STATE event
  store.emit("UPDATE_STATE", newState);
  // OR use a custom event
};
```

**A couple notes:**
If you want a deep clone pass in `$deep: true` into the state on emit. OR `defaultDeep: true` in the options.

```js
const newState = {
  ...newValues,
  $deep: true,
};
```

If you want to emit a custom event, you can pass in a `$type`
If you want a deep clone pass in `$deep: true` into the state on emit. OR `defaultDeep: true` in the options.

```js
const newState = {
  ...newValues,
  $type: "HEIGHT_CHANGE",
};
```

## Interfaces

### IPubSub

```ts
interface IPubSub {
  events: IEvents; //Holds the events and their listeners
  on(eventName: string, fn: Function): void; //Adds a listener to an event
  off(eventName: string, fn: Function): void; //Removes a listener from an event
  removeAll(): void; //Removes all listeners from all events
  removeAllOf(eventName: string): void; //Removes all listeners from a specific event
  emit(eventName: string, data: object): void; //Emits an event with data
}
```

### ISubstate

The Substate instance is a pub/sub pattern with a state storage. It has methods and state storage. It basically handles all your changes for you and acts as a mediator between different parts of your application. It's really a simple pub/sub pattern with data in it. That's all.

```ts
export interface ISubstate extends IPubSub {
  name: string; // name of the instance
  afterUpdate: Function[] | []; // array of functions to be called after state update
  beforeUpdate: Function[] | []; // array of functions to be called before state update
  currentState: number; // index of the current state
  stateStorage: IState[]; // array of states
  defaultDeep: boolean; // default deep clone setting
  getState(index: number): {}; // get state by index
  getCurrentState(): IState; // get current state
  getProp(prop: string): any; // get property from current state
  resetState(): void; // reset state to initial state
  updateState(action: IState): void; // update state with action
}
```

### IConfig

The configuration object for the Substate instance. You pass is into the Substate instance

```ts
export interface IConfig {
  name?: string;
  afterUpdate?: Function[] | [];
  beforeUpdate?: Function[] | [];
  currentState?: number;
  stateStorage?: IState[];
  defaultDeep?: boolean;
  state?: object;
}
```

### IState

```ts
interface IState {
  [key: string]: any;
  $type?: string;
  $deep?: boolean;
}
```

### IEvents

```ts
interface IEvents {
  [id: string]: Function[];
}
```
