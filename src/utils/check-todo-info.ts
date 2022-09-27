import { isString, isBoolean } from './simple-validators'

export const isValidTodo = (todoFromRequest: any): boolean => {
  const { title, isPriority } = todoFromRequest

  return isString(title) && isBoolean(isPriority)
}

export const isNewTodoInfoValid = (newTodoInfoFromRequest: any): boolean => {
  const { isCompleted } = newTodoInfoFromRequest

  return isValidTodo(newTodoInfoFromRequest) && isBoolean(isCompleted)
}
