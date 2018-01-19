# SubState

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

