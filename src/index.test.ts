//FizzBuzz.test.ts
/// <reference types="jest" />
import substate from "./index";

const func1 = jest.fn((x) => {
  x.count ? (x.count = ++x.count) : (x.count = 1);
});
const func2 = jest.fn((x) => {
  x.count2 ? ++x.count2 : (x.count2 = 1);
});

const STATE = {
  name: "Thomas",
  timeOfFun: new Date().toISOString(),
  nested: {
    double: {
      reason: "Just the start",
    },
  },
};

const A = new substate({
  name: "HamburgerStore",
  defaultDeep: true,
  state: STATE,
  beforeUpdate: [func1],
  afterUpdate: [func2],
});

/** initialization tests */
test("creates new instance of substate", () => {
  expect(A instanceof substate).toBe(true);
});

test("expects store to have name", () => {
  expect(A.name).toBe("HamburgerStore");
});

test("events to contain UPDATE_STATE on initialization", () => {
  expect(A.events.UPDATE_STATE).toHaveLength(1);
});

test("get props to return correct value", () => {
  expect(A.getProp("nested.double.reason")).toBe("Just the start");
});

test("getCurrentState returns current state and fires middleware", () => {
  expect(A.getCurrentState()).toMatchObject(STATE);
  A.emit("UPDATE_STATE", { timeOfFun: new Date().toISOString() });
  expect(func1).toHaveBeenCalledTimes(1);
  expect(func2).toHaveBeenCalledTimes(1);
});

test("getState returns correct state from array", () => {
  expect(A.getState(0)).toMatchObject(STATE);
});

test("deep clone works and does not alter older nested state", () => {
  const NEWTEXT = "This has changed";
  A.emit("UPDATE_STATE", { "nested.double.reason": NEWTEXT });
  expect(func1).toHaveBeenCalledTimes(2);
  expect(func2).toHaveBeenCalledTimes(2);
  expect(A.getState(0)).not.toBe(NEWTEXT);
});

test("updateState updates state and fires middleware", () => {
  const NEWTEXT = "This has changed";
  A.emit("UPDATE_STATE", { "nested.double.reason": NEWTEXT });
  expect(func1).toHaveBeenCalledTimes(3);
  expect(func2).toHaveBeenCalledTimes(3);
  expect(A.getProp("nested.double.reason")).toBe(NEWTEXT);
});

test("callback fires for custom $type", () => {
  const myMock = jest.fn();
  const DATEUPDATED = "DATE_UPDATED";
  A.on(DATEUPDATED, myMock);
  A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
  expect(myMock).toHaveBeenCalled();
});

test("callback for custom $type contains correct $type value", () => {
  const myMock = jest.fn();
  const DATEUPDATED = "DATE_UPDATED";
  A.on(DATEUPDATED, myMock);
  A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
  expect(A.getProp("$type")).toBe(DATEUPDATED);
});
