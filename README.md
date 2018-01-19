# SubState

## _note:_ anything marked _| no docs |_ means I haven't documented it yet.

## Purpose
To manage state with a simple PubSub pattern, it returns the whole state or just a chunk of state.  Message filtering can be applied _without_ a `switch` statement

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
| Method        | Desc                                                  | Returns             |
| ------------- |:-----------------------------------------------------:| -------------------:|
| name          | name of the instance                                  | 'SubStateInstance'  |
| currentState  | index of state to start on                            |   0                 |
| stateStorage  | array of all the state                                |    [ ]              |
| saveOnChange  | save state to localStorage on change                  | null                |
| pullFromLocal | pull currentState from localStorage on initialization | null                |
| state         | object containing the initial state                   | null                |
|               |                                                       |                     |

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
