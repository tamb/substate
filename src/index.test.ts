//FizzBuzz.test.ts
/// <reference types="jest" />
import Substate, { ISubstate } from "./index";

const STATE = {
  name: "Thomas",
  timeOfFun: new Date().toISOString(),
  nested: {
    double: {
      reason: "Just the start",
    },
  },
};

let A: ISubstate;
let func1: jest.Mock;
let func2: jest.Mock;
let func3: jest.Mock;
let func4: jest.Mock;

describe("Substate instantiation", () => {
  beforeEach(() => {
    func1 = jest.fn();
    func2 = jest.fn();
    func3 = jest.fn();
    func4 = jest.fn();

    A = new Substate({
      name: "HamburgerStore",
      defaultDeep: true,
      state: STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });
  test("creates new instance of substate", () => {
    expect(A instanceof Substate).toBe(true);
  });

  test("expects store to have name", () => {
    expect(A.name).toBe("HamburgerStore");
  });

  test("events to contain UPDATE_STATE on initialization", () => {
    expect(A.events.UPDATE_STATE).toHaveLength(1);
  });
});

describe("Substate getters", () => {
  beforeEach(() => {
    func1 = jest.fn();
    func2 = jest.fn();
    func3 = jest.fn();
    func4 = jest.fn();

    A = new Substate({
      name: "HamburgerStore",
      defaultDeep: true,
      state: STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });

  test("get props to return correct value", () => {
    expect(A.getProp("nested.double.reason")).toBe("Just the start");
  });

  test("getCurrentState returns current state and fires middleware", () => {
    expect(A.getCurrentState()).toMatchObject(STATE);
    A.emit("UPDATE_STATE", { timeOfFun: new Date().toISOString() });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
    expect(func3).toHaveBeenCalledTimes(1);
    expect(func4).toHaveBeenCalledTimes(1);
  });

  test("getState returns correct state from array", () => {
    expect(A.getState(0)).toMatchObject(STATE);
  });
});

describe("Substate state management", () => {
  beforeEach(() => {
    func1 = jest.fn();
    func2 = jest.fn();
    func3 = jest.fn();
    func4 = jest.fn();

    A = new Substate({
      name: "HamburgerStore",
      defaultDeep: true,
      state: STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });

  test("deep clone does not alter older nested state", () => {
    const NEWTEXT = "This has changed";
    A.emit("UPDATE_STATE", { "nested.double.reason": NEWTEXT });
    expect(A.getState(0)).not.toMatchObject(A.getCurrentState());
    expect(A.getState(0)).not.toMatchObject(A.getCurrentState());
  });

  test("update via string notation works", () => {
    const NEWTEXT = "This has changed";
    A.emit("UPDATE_STATE", { "nested.double": NEWTEXT });
    expect(A.getProp("nested.double")).toMatch(NEWTEXT);
  });

  test("updateState updates state updates nested string", () => {
    const NEWTEXT = "foobar";
    A.updateState({ "nested.double": NEWTEXT });
    expect(A.getCurrentState().nested.double).toBe(NEWTEXT);
  });

  test("updateState fires middleware", () => {
    const NEWTEXT = "foobar";
    A.updateState({ "nested.double": NEWTEXT });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
    expect(func3).toHaveBeenCalledTimes(1);
    expect(func4).toHaveBeenCalledTimes(1);
  });

  test("callback fires for custom $type", () => {
    const myMock = jest.fn();
    const DATEUPDATED = "DATE_UPDATED";
    A.on(DATEUPDATED, myMock);
    A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
    expect(myMock).toHaveBeenCalled();
  });

  test("UPDATE_STATE emit sets $type", () => {
    const DATEUPDATED = "DATE_UPDATED";
    A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
    expect(A.getProp("$type")).toMatch(DATEUPDATED);
  });

  test("Update state sets $type value", () => {
    const DATEUPDATED = "DATE_UPDATED";
    A.updateState({ timeOfFun: new Date(), $type: DATEUPDATED });
    expect(A.getProp("$type")).toMatch(DATEUPDATED);
  });
});
