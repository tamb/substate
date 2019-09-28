import { store } from "../state";

let list = null;

export default function wireList() {
  list = document.querySelector('[data-ref="list"]');

  store.on('UPDATE_TODO', addIt);

}


function addIt(state) {
  let html = ``;
  state.todos.map(todo => {
    return `<li>${todo}</li>`;
  }).forEach(li => {
    html += li;
  });
  list.innerHTML = html;
}
