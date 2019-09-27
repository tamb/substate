# ☂️ substate

## pub/sub state management

## The Problem
State management with Redux is really nice.  But it can get convoluted really quickly.  It's almost like a pub/sub may do the trick, but that's missing modules, immutability, etc.  Well it's hybrid time!

## Purpose
* To manage state with a simple pub/sub pattern
* To improve upon the pub/sub with unidirectional data flow
* For State to return a new state (pure function)
* Message filtering can be applied _without_ a `switch` statement (you create your own event `$type`)
* To allow for manipulation of deeply nested state properties through use of strings `{'my[index]deeply.nests.state': 'new value'}` (we're sending this to substate to _not mutate_ the state, but make a new copy (Flux-y)!
* Maintain a small size


## Contents
* [How it Works](#how-it-works)
    * [The Steps](#the-steps)
    
* [Installation](#installation)
* [Instantiation](#instantiation)
* [Options](#options)
* [State Methods](#state-methods)
* [Event Methods](#event-methods)
* [State Events](#state-events)  
* [Custom Events](#custom-events)
* [Modules and Merging Stores](#modules-and-merging-stores)
* [Usage with React](#usage-with-react)
* [Updates to Come](#updates-to-come)
* [Pull Requests](#pull-requests)


## How it Works

### The Steps
1. (if using modules) `import { myInstance } from 'myFile'`
2. Components will register one or more methods to rerender themselves using your instance (see [instantiation](#instantiation))  using `myInstance.on('STATE_UPDATED', rerender)` per method
3. Components take UI event ("click", "focus", etc) and pass it off to a Handler/Reducer
4. The Handler/Reducer figures out what should change in the state (it does not update the state directly).  It also figures out if/what `$type` should be sent to the Pub/Sub module
5. The Handler/Reducer will then `emit` `UPDATE_STATE` to the Pub/Sub module
6. The Pub/Sub module will create a _new_ state and will `emit` `STATE_UPDATED` or the specified `$type` to the Components.
7. The Components will digest the new State using the method(s) registered in step 2
8. If you want a deep clone pass in `$deep: true` into the state on emit.  OR `defaultDeep: true` in the options. 


## Installation
* `npm install substate --save`
* copy and paste from `index.js` into a `<script>` or external js file

## Instantiation 
substate is a class so you call it like so

_myFile.js_

`import { substate } from 'substate';`

Then you instantiate it as such

`export const myInstance = new substate({options});`

## Options
substate accepts an options object as an optional parameter.
These are the possible options

| Option          | Desc                                                                                   | Default             |
| ---------------- |--------------------------------------------------------------------------------------- | -------------------:|
| name             | name of the instance                                                                   | 'substateInstance'  |
| currentState     | index of state to start on                                                             |   0                 |
| stateStorage     | array of all the states                                                                |    [ ]              | 
| state            | object containing the initial state                                                    | null                |
| defaultDeep      | default to deep cloning the state everytime                                            | false               |
| beforeUpdate[ ]  | array of middleware before state is updated.Has access to substate instance and action | []                |
| afterUpdate[ ]   | array of middleware for after state is updated. Has access to substate instance        | []                |
                                                                                     

## State Methods
* `@param`    optional method parameter
* `@param*`   required method parameter

| Method           | Desc                                                                      | Returns              |
| ---------------- |---------------------------------------------------------------------------| --------------------:|
| getState         | get a state `@param*` - index of state needed                             | state                |
| getcurrentState  | get the current state                                                     | current state object |
| getProp          | get a prop from current state `@param*` - string path to prop             | property you request |
| changeState      | change the version of the state `@param*` - `{requestedState: index of state, action: (optional name of event to emit)}`| emits `action` parameter event or 'STATE_CHANGED' event with the new current state    |
| resetState       | resets the `stateStorage` array to an empty array                         |emits 'STATE_RESET'   |

## Event Methods
* `@param` optional method parameter
* `@param*` required method parameter
* `@param[num]` order of method parameter

| Method        | Desc                                                                                                                  
| ------------- |---------------------------------------------------------------------------------------------------------------------
| on            | `@param1*` STRING of event name to listen to. `@param2*` FUNC handler to execute when this event you listen to happens
| off           | `@param1*` STRING of event name to remove handler from.` @param2*` FUNC to remove from the execution queue             
| emit          | `@param1*` STRING event name  `@param2` object of data to pass into your handler event from 'on' method                          


## State Events
| Event        | Desc                                                   | Returns             |
| ------------- |-------------------------------------------------------| -------------------:|
| 'UPDATE_STATE'|   updates the entire state with the object passed in  | updated state       |
|'CHANGE_STATE' |  fires changeState method above requires same `@param`s|emits 'STATE_CHANGED'|

## Custom Events  
_note: the object of data that is passed, cannot have a key called '$type'_

| Method   | Event                         |  Custom Event                                     | Next                |
| -------- |-------------------------------| --------------------------------------------------|--------------------:|
|  emit    | 'UPDATE_STATE' | `@param2` is an object:   `{$type: 'MY_CUSTOM_EVENT'}` | Will update/change state. The `$type` property will then be emitted so you can listen to it like `substateInstance.on('MY_CUSTOM_EVENT', func)`|

### To clear this ^ up :
Basically to utilitze a custom event, you still need to use `UPDATE_STATE` but the data object needs a `$type` with an event name you want the State to emit _when updated_


## Modules and Merging Stores
substate also ofers a method to merge separate substate instances (stores) into one
```js
import { mergeStores } from 'substate';

const merged = mergeStores([store1, store2], options);

```
You simply provide it an array of stores as the first argument.  And the second argument are options that can be used just as with a single store.

This means you can have separate stores for different modules and merge them together when needed.  This allows for you to micromanage state for separate parts of the app.


## Updates to come
- better dev instructions and console warnings/errors
- seemless compatibility with infernojs, preactjs, stenciljs
- demos demos demos
- better documentation

