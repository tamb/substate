import { store } from '../state';

export const createTodo = text => {
  const newState = {
    $type: "ADD_TODO",
    todos: store.getProp('todos').concat([text])
  };
  store.emit("UPDATE_STATE", newState);
};

