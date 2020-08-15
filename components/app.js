import config from '../config/config.js';
import { todoApi } from '../api/api.js';

import TodoHeader from './todo-header.js';
import TodoList from './todo-list.js';
import TodoInput from './todo-input.js';
import TodoFilter from './todo-filter.js';

export default class App {
  constructor() {
    try {
      this.todos = todoApi.get(config.todos);
      this.filterState = todoApi.get(config.todoFilter, 'all');
      this.filteredTodos = this.filterTodos();

      this.todoHeaderComponent = new TodoHeader();
      this.todoListComponent = new TodoList(
        this.filteredTodos,
        this.toggleTodo.bind(this),
        this.editTodo.bind(this),
        this.removeTodo.bind(this)
      );
      this.todoInputComponent = new TodoInput(this.addTodo.bind(this));
      this.todoFilter = new TodoFilter(
        this.filteredTodos.length,
        this.setFilterState.bind(this)
      );
    } catch (err) {
      console.error(err.message);
    }
  }

  filterTodos() {
    return this.todos.filter((todo) => {
      if (location.hash === '#active') {
        return !todo.toggle;
      }
      if (location.hash === '#completed') {
        return todo.toggle;
      }
      return true;
    });
  }

  render() {
    this.filteredTodos = this.filterTodos();
    this.todoListComponent.setState(this.filteredTodos);
    this.todoFilter.setState(this.filteredTodos.length);
  }

  setTodoState(todos) {
    this.todos = todos;
    todoApi.set(config.todos, todos);
    this.render();
  }

  setFilterState(filterState) {
    location.hash = `#${filterState}`;
    this.filterState = filterState;
    todoApi.set(config.todoFilter, filterState);
    this.render();
  }

  toggleTodo(targetId) {
    const newTodos = this.todos.map((todo) => {
      if (todo.id === targetId) {
        todo.toggle = !todo.toggle;
      }
      return todo;
    });
    this.setTodoState(newTodos);
  }

  addTodo(todo) {
    this.setTodoState([...this.todos, todo]);
  }

  editTodo(targetId, changeValue) {
    const newTodos = this.todos.map((todo) => {
      if (todo.id === targetId) {
        todo.editMode = !todo.editMode;
        if (changeValue && todo.text !== changeValue) {
          todo.text = changeValue;
        }
      }
      return todo;
    });
    this.setTodoState(newTodos);
  }

  removeTodo(targetId) {
    const newTodos = this.todos.filter((todo) => todo.id !== targetId);
    this.setTodoState(newTodos);
  }
}
