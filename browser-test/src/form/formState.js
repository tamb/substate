import { substate } from "substate";

const store = new substate({
  name: "formState",
  state: {
    todos: []
  }
});

export const createTodo = text => {
  const newState = {
    // $type: "ADD_TODO",
    todos: [text]
  };
  store.emit("UPDATE_STATE", newState);
};

export default store;
