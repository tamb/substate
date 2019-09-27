export const addTodoList = state => {
  return state.todos.map(todo => {
    return `<li>${todo}</li>`;
  });
};