import { store } from "../state";

export default function wireUndoRedo() {
  const undo = document.querySelector('[data-ref="undo"]');
  const redo = document.querySelector('[data-ref="redo"]');

  redo.addEventListener("click", () => {
    if (store.currentState !== store.stateStorage.length - 1) {
      store.emit("CHANGE_STATE", {
        requestedState: (store.currentState + 1),
        $type: "UPDATE_TODO"
      });
    }
  });

  undo.addEventListener("click", () => {
    if (store.currentState !== 0) {
      store.emit("CHANGE_STATE", {
        requestedState: (store.currentState -1),
        $type: "UPDATE_TODO"
      });
    }
  });
}
