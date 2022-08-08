import { NewTodoEntry } from '../types'
import { isString, isBoolean, isDate } from './validators'

const parseTitle = (titleFromRequest: any): string => {
  if (!isString(titleFromRequest)) {
    throw new Error('Todo title must be of type string')
  }

  return titleFromRequest
}

const parsePriority = (priorityFromRequest: any): boolean => {
  if (!isBoolean(priorityFromRequest)) {
    throw new Error('Todo priority must be of type boolean (true or false)')
  }

  return priorityFromRequest
}

const parseDate = (dateFromRequest: any): string => {
  if (!isDate(dateFromRequest) || !isString(dateFromRequest)) {
    throw new Error('Must be a valid date')
  }

  return dateFromRequest
}

const toNewTodo = (requestObject: any): NewTodoEntry => {
  const newTodo: NewTodoEntry = {
    title: parseTitle(requestObject.title),
    isPriority: parsePriority(requestObject.isPriority),
    date: parseDate(requestObject.date)
  }

  return newTodo
}

export default toNewTodo
