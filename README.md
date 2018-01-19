# SubState

## The Problem
State management with Redux is killer.  But it requires switch statements and works poorly with deeply nested states.

## Purpose
* To manage state with a simple PubSub pattern
* For State to return the whole state or just a chunk of state (just what you need).  
* Message filtering can be applied _without_ a `switch` statement (you create your own event types)
* To allow for manipulation of deeply nested state properties through use of strings
* Maintain a small size.  Currently it's 7kb minified, 2kb gzipped

## _note:_ anything marked _| no docs |_ means I haven't documented it yet.

## Contents
1. [Demo](#demo)
2. [Installation](#installation)
3. [Instantiation](#instantiation)
4. [Options](#options)
5. [Initialization](#initialization)
6. [State Methods](#state-methods)
7. [Event Methods](#event-methods)
8. [State Events](#state-events)  _| no docs |_
9. [Custom Events](#custom-events) _| no docs |_
10. [Updates to Come](#updates-to-come)

## Demo
[This is a simple demo.](//jsfiddle.net/TomSaporito/s3oykwoe/embedded/result/)  The module can be observed in the console

## Installation
* `npm install substate --save`
* copy and paste from `index.js` into a `<script>` or external js file

## Instantiation 
SubState is a class so you call it like so

`import SubState from 'substate';`

Then you instantiate it as such

`var s = new SubState();`

## Options
Substate accepts an options object as an optional parameter.
These are the possible options

| Option        | Desc                                                  | Default             |
| ------------- |-------------------------------------------------------| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the states                               |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
                                                                                     

## Initialization
to initialize the class call

`instance.init()`

## State Methods
* `@param`    optional method parameter
* `@param*`   required method parameter

| Method           | Desc                                                                      | Returns              |
| ---------------- |---------------------------------------------------------------------------| --------------------:|
| getState         | get a state `@param*` - index of state needed                             | state                |
| getcurrentState  | get the current state                                                     | current state object |
| getProp          | get a prop from current state `@param*` - string path to prop             | property you request |
| changeState      | change the version of the state `@param*` - `{requestedState: index of state, action: (optional name of event to emit)}`| emits `action` parameter event or 'STATE_CHANGED' event with the new current state    |
| saveState        | save stateStorage array to localStorage.  Will use instance param of name | emits 'STATE_SAVED'  |
| removeSavedState | removed state from LocalStorage                                           |emits 'STATE_REMOVED_SAVED_STATE'|
| resetState       | resets the `stateStorage` array to an empty array                         |emits 'STATE_RESET'   |

## Event Methods
* `@param` optional method parameter
* `@param*` required method parameter
* `@param[num]` order of method parameter

| Method        | Desc                                                                                                                  
| ------------- |---------------------------------------------------------------------------------------------------------------------
| on            | `@param1*` STRING of event name to listen to. `@param2*` FUNC handler to execute when this event you listen to happens
| off           | `@param1*` STRING of event name to remove handler from.` @param2*` FUNC to remove from the execution queue             
| emit          | `@param1*` STRING event name  `@param2` data to pass into your handler event from 'on' method                          


## State Events
| Method        | Desc                                                  | Returns             |
| ------------- |-------------------------------------------------------| -------------------:|
|           |                                |   |


## Custom Events  
| Method        | Desc                                                  | Returns             |
| ------------- |-------------------------------------------------------| -------------------:|
|          |                                   |   |


## Updates to come
1. Updated documentation on events
2. Additional documentation on the "| no docs |" sections
3. documentation on special array methods for state
4. change 'action' nomenclature to 'event'
