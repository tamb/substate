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

## Demo
[This is a simple demo.](//jsfiddle.net/TomSaporito/s3oykwoe/embedded/result/)  The module can be observed in the console

## Installation
`npm install substate --save`

## Instantiation 
SubState is a class so you call it like so

`import SubState from 'substate';`

Then you instantiate it as such

`var s = new SubState();`

## Options
Substate accepts an options object as an optional parameter.
These are the possible options

| Option        | Desc                                                  | Default             |
| ------------- |:-----------------------------------------------------:| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the states                               |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
|               |                                                       |                     |

## Initialization
to initialize the class call

`instance.init()`

## State Methods
* `@param`    param the method can accept
* `@param*`   required param for method

| Method           | Desc                                                                      | Returns              |
| ---------------- |:-------------------------------------------------------------------------:| --------------------:|
| getState         | get a state `@param*` - index of state needed                             | state                |
| getcurrentState  | get the current state                                                     | current state object |
| getProp          | get a prop from current state `@param*` - string path to prop             | property you request |
| changeState      | change the version of the state `@param*` - `{requestedState: index of state, action: (optional name of event to emit)}`| emits `action` parameter event or 'STATE_CHANGED' event with the new current state    |
| saveState        | save stateStorage array to localStorage                                   | null                 |
| state            | object containing the initial state                                       | null                 |
|                  |                                                                           |                      |

## Event Methods _| no docs |_
| Method        | Desc                                                  | Returns             |
| ------------- |:-----------------------------------------------------:| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the state                                |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
|               |                                                       |                     |

## Events  _| no docs |_
| Method        | Desc                                                  | Returns             |
| ------------- |:-----------------------------------------------------:| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the state                                |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
|               |                                                       |                     |

## Custom Events  _| no docs |_
| Method        | Desc                                                  | Returns             |
| ------------- |:-----------------------------------------------------:| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the state                                |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
|               |                                                       |                     |

## Updates to come
1. Updated documentation on events
2. Additional documentation on the "| no docs |" sections
3. Changed Event Names to a standardized format
4. documentation on special array methods for state
