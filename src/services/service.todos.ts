import todosJSON from './todos.json'
import { Todo, NewTodoEntry } from '../types'

const todos: Todo[] = todosJSON

export const getTodos = (): Todo[] => todos

export const addTodo = (newTodoEntry: NewTodoEntry): Todo => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000),
    isCompleted: false,
    ...newTodoEntry
  }

  todos.push(newTodo)

  return newTodo
}

export const deleteTodo = (todo: Todo): boolean | undefined => {
  let todoDeleted
  const todoIndex = todos.findIndex((todoObj) => todoObj.id === todo.id)

  if (todoIndex > -1) {
    todos.splice(todoIndex, 1)
    todoDeleted = true
  }

  return todoDeleted
}
