import { isString, isBoolean } from './simple-validators'

export const isValidTodo = ({ title, isPriority }: any): boolean => {
  return isString(title) && isBoolean(isPriority)
}
