import { substate } from "substate";

const store = new substate({
  name: "listState"
});

export const addTodoList = state => {
  return state.getProp("todos").map(todo => {
    return `<li>${todo}</li>`;
  });
};

export default store;
