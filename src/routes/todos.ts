import express from 'express'
import { Todo } from '../models/todo'
import { User } from '../models/user'
import { isValidTodo } from '../utils/check-todo-info'
import userExtractor, { ExtractorRequest } from '../middlewares/user-extractor'
import todoOwnership from '../middlewares/todo-ownership'
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
  const { id } = req.params

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
  todoOwnership,
  async (req: ExtractorRequest, res, next) => {
    if (req.method !== 'DELETE') return res.status(405).end()

    const { id } = req.params

    try {
      await Todo.findByIdAndDelete(id)

      res.status(204).end()
    } catch (err) {
      next(err)
    }
  }
)

router.post('/', userExtractor, async (req: ExtractorRequest, res, next) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, isPriority } = req.body

  const { userId } = req

  const user = await User.findById(userId)

  if (!title) {
    return res.status(400).json({
      error: 'Todo title must be specified'
    })
  }

  if (!isValidTodo({ title, isPriority })) {
    return res.status(400).send({
      error:
        'Invalid Todo format. Todo title must be of type string and Todo priority must be of type boolean.'
    })
  }

  const newTodoToAdd = new Todo({
    isCompleted: false,
    date: Date.now(),
    title,
    isPriority,
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

router.put(
  '/:id',
  userExtractor,
  todoOwnership,
  async (req: ExtractorRequest, res, next) => {
    if (req.method !== 'PUT') return res.status(405).end()

    const { id } = req.params

    const { title, isPriority, isCompleted } = req.body

    if (!title) {
      return res.status(400).send({
        error: 'Todo title must be specified.'
      })
    }

    const newTodoContent = {
      title,
      isPriority,
      isCompleted
    }

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, newTodoContent, {
        new: true
      })

      res.json(updatedTodo)
    } catch (err) {
      next(err)
    }
  }
)

router.use(notFound)
router.use(handleErrors)

export default router
