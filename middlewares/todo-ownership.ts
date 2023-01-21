import { Response, NextFunction } from 'express'
import { Todo } from '../models/todo'
import { ExtractorRequest } from './user-extractor'

export default async (
  req: ExtractorRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const { userId } = req

  try {
    const todoToDelete = await Todo.findById(id)

    if (!todoToDelete) return res.status(404).end()

    const userIdInTodo = todoToDelete.user.toString()

    if (userIdInTodo !== userId) {
      return res
        .status(401)
        .send('You are not authorized to manipulate this todo.')
    }

    next()
  } catch (err) {
    next(err)
  }
}
