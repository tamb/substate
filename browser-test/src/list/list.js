import { store } from '../state';
import { addTodoList } from "./listState";

export default function wireList() {
  const list = document.querySelector('[data-ref="list"]');

  function addIt(state) {
    console.log(state);
    list.innerHTML = addTodoList(state).flat();
  }

  store.on("ADD_TODO", addIt);
}
