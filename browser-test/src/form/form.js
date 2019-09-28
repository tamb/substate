import { store } from '../state';

function createTodo (text) {
  const newState = {
    $type: "UPDATE_TODO",
    todos: store.getProp('todos').concat([text])
  };
  store.emit("UPDATE_STATE", newState);
};

export default function wireForm() {
  const form = document.querySelector('[data-ref="form"]');
  form.addEventListener("submit", e => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const text = input.value;
    if (text.length > 0) {
      createTodo(text);
      input.value = '';
    }
  });
}
