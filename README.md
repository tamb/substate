# SubState

## The Problem
State management with Redux is really nice.  It's also nice with Vuex.  And a lot of people don't like Pub/Sub because they lose track of events.  Well it's hybrid time!

## Purpose
* To manage state with a simple PubSub pattern
* For State to return the whole state or just a chunk of state (just what you need).  
* Message filtering can be applied _without_ a `switch` statement (you create your own event `$type`)
* To allow for manipulation of deeply nested state properties through use of strings `{'my[index]deeply.nests.state': 'new value'}` (we're sending this to SubState to _not mutate_ the state, but make a new copy (Flux-y)!
* Maintain a small size.  Currently it's <6kb minified, <2kb gzipped!

## _note:_ anything marked _| no docs |_ means I haven't documented it yet.

## Contents
1. [Demos](#demos)
2. [Installation](#installation)
3. [Instantiation](#instantiation)
4. [Options](#options)
5. [Initialization](#initialization)
6. [State Methods](#state-methods)
7. [Event Methods](#event-methods)
8. [State Events](#state-events)  
9. [Custom Events](#custom-events)
10. [Updates to Come](#updates-to-come)

## Demos
* [Download and run this:](https://github.com/TomSaporito/substate-demo)
`npm install`
`webpack`
open `index.html`
* [Demo showing State object changing.](//jsfiddle.net/TomSaporito/s3oykwoe/embedded/result/)  The module can be observed in the console
* [Demo with React and VanillaJS](https://next.plnkr.co/plunks/nR9n5efElxC4avt2)

* _new demos forth-coming with React, Vanilla JS, jQuery_
![](SubState.png)
 _a "Subscriber" can be your React Component/Anything that will ingest a state object and rerender HTML_


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
When you initialize the class it wires up the three events in [State Events](#state-events)

## State Methods
* `@param`    optional method parameter
* `@param*`   required method parameter

| Method           | Desc                                                                      | Returns              |
| ---------------- |---------------------------------------------------------------------------| --------------------:|
| $getState         | get a state `@param*` - index of state needed                             | state                |
| $getcurrentState  | get the current state                                                     | current state object |
| $getProp          | get a prop from current state `@param*` - string path to prop             | property you request |
| $changeState      | change the version of the state `@param*` - `{requestedState: index of state, action: (optional name of event to emit)}`| emits `action` parameter event or 'STATE_CHANGED' event with the new current state    |
| $saveState        | save stateStorage array to localStorage.  Will use instance param of name | emits 'STATE_SAVED'  |
| $removeSavedState | removed state from LocalStorage                                           |emits 'STATE_REMOVED_SAVED_STATE'|
| $resetState       | resets the `stateStorage` array to an empty array                         |emits 'STATE_RESET'   |

## Event Methods
* `@param` optional method parameter
* `@param*` required method parameter
* `@param[num]` order of method parameter

| Method        | Desc                                                                                                                  
| ------------- |---------------------------------------------------------------------------------------------------------------------
| $on            | `@param1*` STRING of event name to listen to. `@param2*` FUNC handler to execute when this event you listen to happens
| $off           | `@param1*` STRING of event name to remove handler from.` @param2*` FUNC to remove from the execution queue             
| $emit          | `@param1*` STRING event name  `@param2` object of data to pass into your handler event from 'on' method                          


## State Events
| Event        | Desc                                                   | Returns             |
| ------------- |-------------------------------------------------------| -------------------:|
| 'UPDATE_STATE'|   updates the entire state with the object passed in  | updated state       |
|'UPDATE_CHUNK' |   updates part of a state, this does not iterate over the entire state object| the data passed in|
|'CHANGE_STATE' |  fires changeState method above requires same `@param`s|emits 'STATE_CHANGED'|

## Custom Events  
_note: the object of data that is passed, cannot have a key called '$type'_

| Method   | Event                         |  Custom Event                                     | Next                |
| -------- |-------------------------------| --------------------------------------------------|--------------------:|
|  $emit    | 'UPDATE_CHUNK' _or_ 'UPDATE_STATE' | `@param2` is an object:   `{$type: 'MY_CUSTOM_EVENT'}` | Will update/change state. The `$type` property will then be emitted so you can listen to it like `SubStateInstance.on('MY_CUSTOM_EVENT', func)`|

### To clear this ^ up :
Basically to utilitze a custom event, you still need to use `UPDATE_STATE`/`UPDATE_CHUNK` but the data object needs a `$type` with an event name you want the State to emit _when updated_

## Updates to come
Nothin' here, buddy.
