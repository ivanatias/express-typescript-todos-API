import express from 'express'
import { Todo } from '../models/todo'
import { User } from '../models/user'
import { isValidTodo } from '../utils/check-todo-info'
import { checkTodoOwnership } from '../utils/check-todo-ownership'
import userExtractor, { ExtractorRequest } from '../middlewares/user-extractor'
import notFound from '../middlewares/not-found'
import handleErrors from '../middlewares/handle-errors'

const router = express.Router()

const todosUserInfoReturned = {
  username: 1,
  name: 1
}

router.get('/', async (_req, res, next) => {
  try {
    const todos = await Todo.find({}).populate('user', todosUserInfoReturned)

    res.json(todos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const id: string = req.params.id

  try {
    const foundTodo = await Todo.findById(id).populate(
      'user',
      todosUserInfoReturned
    )

    if (!foundTodo) return res.status(404).end()

    res.json(foundTodo)
  } catch (err) {
    next(err)
  }
})

router.delete(
  '/:id',
  userExtractor,
  async (req: ExtractorRequest, res, next) => {
    if (req.method !== 'DELETE') return res.status(405).end()

    const id: string = req.params.id
    const formatedTodoId = id.substring(3)

    const { userId } = req

    const isTodoOwnedByUser = await checkTodoOwnership(formatedTodoId, userId)

    if (isTodoOwnedByUser !== undefined && !isTodoOwnedByUser) {
      return res.status(401).send({
        message: 'You are not authorized to delete this todo.'
      })
    }

    try {
      const todoToDelete = await Todo.findByIdAndDelete(formatedTodoId)

      if (!todoToDelete) return res.status(404).end()

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)

router.post('/', userExtractor, async (req: ExtractorRequest, res, next) => {
  if (req.method !== 'POST') return res.status(405).end()

  const todoFromRequest = req.body

  const { userId } = req

  const user = await User.findById(userId)

  if (!todoFromRequest.title) {
    return res.status(400).json({
      error: 'Todo title must be specified'
    })
  }

  if (!isValidTodo(todoFromRequest)) {
    return res.status(400).send({
      error:
        'Invalid Todo format. Todo title must be of type string and Todo priority must be of type boolean.'
    })
  }

  const newTodoToAdd = new Todo({
    isCompleted: false,
    date: Date.now(),
    title: todoFromRequest.title,
    isPriority: todoFromRequest.isPriority,
    user: user?.id
  })

  try {
    const savedTodo = await newTodoToAdd.save()

    user?.todos.push(savedTodo._id)

    await user?.save()

    res.json(savedTodo)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', userExtractor, async (req: ExtractorRequest, res, next) => {
  if (req.method !== 'PUT') return res.status(405).end()

  const id: string = req.params.id
  const formatedTodoId = id.substring(3)

  const { userId } = req

  const newTodoInfoFromRequest = req.body

  if (!newTodoInfoFromRequest.title) {
    return res.status(400).send({
      error: 'Todo title must be specified.'
    })
  }

  const isTodoOwnedByUser = await checkTodoOwnership(formatedTodoId, userId)

  if (isTodoOwnedByUser !== undefined && !isTodoOwnedByUser) {
    return res.status(401).send({
      message: 'You are not authorized to edit this todo.'
    })
  }

  const newTodoContent = {
    title: newTodoInfoFromRequest.title,
    isPriority: newTodoInfoFromRequest.isPriority,
    isCompleted: newTodoInfoFromRequest.isCompleted
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      formatedTodoId,
      newTodoContent,
      { new: true }
    )

    if (!updatedTodo) return res.status(404).end()

    res.json(updatedTodo)
  } catch (err) {
    next(err)
  }
})

router.use(notFound)
router.use(handleErrors)

export default router
