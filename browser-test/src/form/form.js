import { createTodo } from "./formState";
export default function wireForm() {
  const form = document.querySelector('[data-ref="form"]');
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = e.target.querySelector("input").value;
    if (text.length > 0) {
      createTodo(text);
    }
  });
}
