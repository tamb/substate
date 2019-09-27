import store, { addTodoList } from "./listState";

export default function wireList() {
  const list = document.querySelector('[data-ref="list"]');

  function addIt() {
    console.log("oh");
    list.innerHTML = addTodoList();
  }

  store.on("STATE_UPDATED", addIt);
  console.log(store);
}
