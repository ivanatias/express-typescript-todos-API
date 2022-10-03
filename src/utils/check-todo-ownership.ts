import { Todo } from '../models/todo'

export const checkTodoOwnership = async (
  todoId: string,
  userId: string | undefined
): Promise<boolean | undefined> => {
  const todo = await Todo.findById(todoId)

  const idInTodo = todo?.user.toString()

  const todoExists = idInTodo !== undefined

  const isTodoOwnedByUser = todoExists ? idInTodo === userId : undefined

  return isTodoOwnedByUser
}
