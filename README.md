# ⛱️ substate

## pub/sub state management

## The Problem

State management with Redux is really nice but sometimes there's a lot of boilerplate that people don't want. It also requires a hands-on approach to updating state. How do we abstract away the cloning and deep cloning of state?

## Purpose

- To manage state with a simple pub/sub pattern
- To improve upon the pub/sub with unidirectional data flow
- For State to return a new state (pure function)
- Message filtering can be applied _without_ a `switch` statement (you create your own event `$type`)
- To allow for manipulation of deeply nested state properties through use of strings `{'my[index]deeply.nests.state': 'new value'}` (we're sending this to substate to _not mutate_ the state, but make a new copy (Flux-y)!
- Maintain a small size

## Contents

- [Flow](#flow)
- [Terms](#terms)
  - [store](#store)
  - [emit](#emit)
  - [on](#on)
  - [off](#off)
  - [payload](#payload)
- [How it Works](#how-it-works)
  - [The Steps](#the-steps)
- [Demo](#demo)
- [Installation](#installation)
- [Development Mode](#development-mode)
- [Instantiation](#instantiation)
- [Options](#options)
- [State Methods](#state-methods)
- [Event Methods](#event-methods)
- [State Events](#state-events)
- [Custom Events](#custom-events)
- [Usage with React](#usage-with-react)
- [Updates to Come](#updates-to-come)
- [Pull Requests](#pull-requests)

## Flow

![flow](https://github.com/tamb/substate/blob/master/substate-flow.png)

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
import substate from "substate";

export const store = new substate({
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
  };

  store.emit("UPDATE_STATE", newState);
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

## Demo

https://codesandbox.io/embed/todo-with-undo-vgvl0?autoresize=1&fontsize=14

## Installation

- `npm install substate --save`
- copy and paste from `index.js` into a `<script>` or external js file

ES2015 Version

```js
// ES Module
import substate from "substate";

// Node
const substate = require("substate");

// Dev Version
// ES Module
import substate from "substate/dist/index.dev.js";

// Node
const substate = require("substate/dist/index.dev.js");
```

ES5 Version

```js
// ES Module
import substate from "substate/dist/index.es5.js";

// Node
const substate = require("substate/dist/index.es5.js");

// Dev Version
// ES Module
import substate from "substate/dist/index.es5.dev.js";

// Node
const substate = require("substate/dist/index.es5.dev.js");
```

## Development Mode

Running the `*.dev.js` versions of substate will output a warning that you are using the developer mode.  
This will use `console.debug` to display:

- What data changed
- What action type caused this change
- Where was this action fired from

## Instantiation

substate is a class so you call it like so

_myFile.js_

`import { substate } from 'substate';`

Then you instantiate it as such

`export const myInstance = new substate({options});`

## Options

substate accepts an options object as an optional parameter.
These are the possible options

| Option          | Desc                                                                                   |            Default |
| --------------- | -------------------------------------------------------------------------------------- | -----------------: |
| name            | name of the instance                                                                   | 'substateInstance' |
| currentState    | index of state to start on                                                             |                  0 |
| stateStorage    | array of all the states                                                                |                [ ] |
| state           | object containing the initial state                                                    |               null |
| defaultDeep     | default to deep cloning the state everytime                                            |              false |
| beforeUpdate[ ] | array of middleware before state is updated.Has access to substate instance and action |                 [] |
| afterUpdate[ ]  | array of middleware for after state is updated. Has access to substate instance        |                 [] |

## State Methods

- `@param` optional method parameter
- `@param*` required method parameter

| Method          | Desc                                                                                                                     |                                                                            Returns |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------: |
| getState        | get a state `@param*` - index of state needed                                                                            |                                                                              state |
| getcurrentState | get the current state                                                                                                    |                                                               current state object |
| getProp         | get a prop from current state `@param*` - string path to prop                                                            |                                                               property you request |
| changeState     | change the version of the state `@param*` - `{requestedState: index of state, action: (optional name of event to emit)}` | emits `action` parameter event or 'STATE_CHANGED' event with the new current state |
| resetState      | resets the `stateStorage` array to an empty array                                                                        |                                                                emits 'STATE_RESET' |

## Event Methods

- `@param` optional method parameter
- `@param*` required method parameter
- `@param[num]` order of method parameter

| Method | Desc                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| on     | `@param1*` STRING of event name to listen to. `@param2*` FUNC handler to execute when this event you listen to happens |
| off    | `@param1*` STRING of event name to remove handler from.`@param2*` FUNC to remove from the execution queue              |
| emit   | `@param1*` STRING event name `@param2` object of data to pass into your handler event from 'on' method                 |

## State Events

| Event          | Desc                                                                                   |               Returns |
| -------------- | -------------------------------------------------------------------------------------- | --------------------: |
| 'UPDATE_STATE' | updates the entire state with the object passed in                                     |         updated state |
| 'CHANGE_STATE' | fires changeState method requires `requestedState` as the index of the state you want. | emits 'STATE_CHANGED' |

## Custom Events

_note: the object of data that is passed, cannot have a key called '\$type'_

| Method | Event          | Custom Event                                         |                                                                                                                                            Next |
| ------ | -------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------: |
| emit   | 'UPDATE_STATE' | `@param2` is an object: `{$type: 'MY_CUSTOM_EVENT'}` | Will update/change state. The `$type` property will then be emitted so you can listen to it like `substateInstance.on('MY_CUSTOM_EVENT', func)` |

### To clear this ^ up :

Basically to utilitze a custom event, you still need to use `UPDATE_STATE` but the data object needs a `$type` with an event name you want the State to emit _when updated_

## Updates to come

- better dev instructions and console warnings/errors
- typescript support
- seemless compatibility with react, infernojs, preactjs, stenciljs
- demos demos demos
- better documentation
