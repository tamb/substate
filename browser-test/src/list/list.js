import { store } from '../state';
import { addTodoList } from "./listState";

export default function wireList() {
  const list = document.querySelector('[data-ref="list"]');

  function addIt(state) {
    console.log(state);
    let html = ``;
    addTodoList(state).forEach(li => {
      html += li;
    });
    list.innerHTML = html;
  }

  store.on("ADD_TODO", addIt);
}
