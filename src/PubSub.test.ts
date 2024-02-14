//FizzBuzz.test.ts
/// <reference types="jest" />

import PubSub from "./PubSub";

// https://jestjs.io/docs/en/es6-class-mocks

const pub = new PubSub();
const shout = jest.fn();
const whisper = jest.fn();

test("creates new instance of pubsub", () => {
  expect(pub instanceof PubSub).toBe(true);
});

test("new pubsub has empty events object", () => {
  expect(typeof pub.events).toBe("object");
  expect(Object.keys(pub.events).length).toBe(0);
});

test("should add key SPEAK with value of type array", () => {
  pub.on("SPEAK", shout);
  expect(Array.isArray(pub.events.SPEAK)).toBe(true);
});

test("SPEAK array should contain function of name shout", () => {
  expect(pub.events.SPEAK).toContain(shout);
});

test("SPEAK array to contain function of name whisper", () => {
  pub.on("SPEAK", whisper);
  expect(pub.events.SPEAK).toContain(whisper);
});

test("Emitting SPEAK should call both shout and whisper", () => {
  pub.emit("SPEAK");
  expect(shout.mock.calls.length).toBe(1);
  expect(whisper.mock.calls.length).toBe(1);
  pub.emit("SPEAK");
  expect(shout.mock.calls.length).toBe(2);
  expect(whisper.mock.calls.length).toBe(2);
});

test("SPEAK array to contain function of name whisper", () => {
  pub.off("SPEAK", whisper);
  expect(pub.events.SPEAK).not.toContain(whisper);
});

test("Emitting SPEAK should call shout and not whisper", () => {
  pub.emit("SPEAK");
  expect(shout.mock.calls.length).toBe(3);
  expect(whisper.mock.calls.length).toBe(2);
});

test("emit without data contains empty object", () => {
  const mockFn = jest.fn((obj) => obj);
  pub.on("HELLO", mockFn);
  pub.emit("HELLO");
  expect(mockFn).toReturnWith({});
});

test("emit with data contains data object", () => {
  const mockFn = jest.fn((obj) => obj);
  pub.on("HELLO", mockFn);
  pub.emit("HELLO", { name: "world" });
  expect(mockFn).toReturnWith({ name: "world" });
});

test("remove all events", () => {
  pub.on("HELLO", shout);
  pub.on("SPEAK", whisper);
  pub.removeAll();
  expect(Object.keys(pub.events).length).toBe(0);
});

test("remove all events of a specific type", () => {
  pub.on("HELLO", shout);
  pub.on("HELLO", whisper);
  pub.removeAllOf("HELLO");
  expect(pub.events.HELLO).toEqual([]);
});
