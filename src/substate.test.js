const substate = require("../dist");

const es5Substate = require("../dist/index.es5");

const func1 = jest.fn((x) => {
  x.count ? (x.count = ++x.count) : (x.count = 1);
});
const func2 = jest.fn((x) => {
  x.count2 ? ++x.count2 : (x.count2 = 1);
});

const STATE = {
  name: "Thomas",
  timeOfFun: new Date(),
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
  A.emit("UPDATE_STATE", { timeOfFun: new Date() });
  expect(A.count).toBe(1);
  expect(A.count2).toBe(1);
  expect(A.getCurrentState()).not.toMatchObject(STATE);
});

test("getState returns correct state from array", () => {
  expect(A.getState(0)).toMatchObject(STATE);
});

test("deep clonse works and does not alter older nested state", () => {
  const NEWTEXT = "This has changed";
  A.emit("UPDATE_STATE", { "nested.double.reason": NEWTEXT });
  expect(A.count).toBe(2);
  expect(A.count2).toBe(2);
  expect(A.getState(0)).not.toBe(NEWTEXT);
});

test("callback fires for custom $type", () => {
  const myMock = jest.fn();
  const DATEUPDATED = "DATE_UPDATED";
  A.on(DATEUPDATED, myMock);
  A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
  expect(myMock).toBeCalled();
});

test("callback for custom $type contains correct $type value", () => {
  const myMock = jest.fn();
  const DATEUPDATED = "DATE_UPDATED";
  A.on(DATEUPDATED, myMock);
  A.emit("UPDATE_STATE", { timeOfFun: new Date(), $type: DATEUPDATED });
  expect(A.getProp("$type")).toBe(DATEUPDATED);
});

describe("ES5 version tests", () => {
  const deepStore = new es5Substate({
    state: {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  name: "Marco",
                },
              },
            },
          },
        },
      },
    },
    defaultDeep: true,
  });

  const shallowStore = new es5Substate({
    state: {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  name: "Ruth",
                },
              },
            },
          },
        },
      },
    },
  });

  test("deep clone works by default", () => {
    deepStore.emit("UPDATE_STATE", { "a.b.c.d.e.f.name": "Frank" });
    expect(deepStore.getCurrentState().a.b.c.d.e.f.name).toMatch("Frank");
  });

  test("deep clone when passed in", () => {
    shallowStore.emit("UPDATE_STATE", {
      "a.b.c.d.e.f.name": "Danny",
      $deep: true,
    });
    expect(shallowStore.getCurrentState().a.b.c.d.e.f.name).toMatch("Danny");
  });
});
