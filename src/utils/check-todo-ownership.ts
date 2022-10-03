import { Todo } from '../models/todo'

interface TodoOwnership {
  todoExists: boolean
  isTodoOwnedByUser: boolean
}

export const checkTodoOwnership = async (
  todoId: string,
  userId: string | undefined
): Promise<TodoOwnership> => {
  const todo = await Todo.findById(todoId)

  const idInTodo = todo?.user.toString()

  const todoExists = idInTodo !== undefined

  const isTodoOwnedByUser = idInTodo === userId

  return {
    todoExists,
    isTodoOwnedByUser
  }
}
