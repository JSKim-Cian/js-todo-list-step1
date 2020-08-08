export default class TodoInput {
  constructor(addTodo) {
    this.todoInputElement = document.querySelector('#new-todo-input');
    this.render();
    this.addEvent();
    this.addTodo = addTodo;
  }

  addEvent() {
    this.todoInputElement.addEventListener('keyup', ($event) => {
      if ($event.code !== 'Enter') {
        return;
      }

      const inputValue = $event.target.value;
      this.addTodo({
        toggle: false,
        text: inputValue,
      });
      $event.target.value = '';
    });
  }

  render() {
    this.todoInputElement.innerHTML = `
      <input
        id="new-todo-title"
        class="new-todo"
        placeholder="할일을 추가해주세요"
        autofocus
      />
    `;
  }
}
