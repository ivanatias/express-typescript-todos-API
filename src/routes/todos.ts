import express from 'express'
import { Todo } from '../models/todo'
import { isValidTodo } from '../utils/check-todo-info'
import notFound from '../middlewares/not-found'
import handleErrors from '../middlewares/handle-errors'

const router = express.Router()

router.get('/', (_req, res, next) => {
  Todo.find({})
    .then((todos) => {
      res.json(todos)
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/:id', (req, res, next) => {
  const id: string = req.params.id

  Todo.findById(id)
    .then((foundTodo) => {
      if (!foundTodo) return res.status(404).end()
      res.json(foundTodo)
    })
    .catch((err) => {
      next(err)
    })
})

router.delete('/:id', (req, res, next) => {
  if (req.method !== 'DELETE') return res.status(405).end()

  const id: string = req.params.id

  const formatedId = id.substring(3)

  Todo.findByIdAndDelete(formatedId)
    .then((todoToDelete) => {
      if (!todoToDelete) return res.status(404).end()
      res
        .status(204)
        .send({ message: `Todo with ID ${formatedId} was deleted.` })
    })
    .catch((err) => {
      next(err)
    })
})

router.post('/', (req, res, next) => {
  const todoFromRequest = req.body

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
    isPriority: todoFromRequest.isPriority
  })

  newTodoToAdd
    .save()
    .then((todo) => {
      res.status(201).json(todo)
    })
    .catch((err) => {
      next(err)
    })
})

router.put('/:id', (req, res, next) => {
  if (req.method !== 'PUT') return res.status(405).end()

  const id: string = req.params.id
  const formatedId = id.substring(3)

  const newTodoInfoFromRequest = req.body

  if (!newTodoInfoFromRequest.title) {
    return res.status(400).send({
      error: 'Todo title must be specified.'
    })
  }

  const newTodoContent = {
    title: newTodoInfoFromRequest.title,
    isPriority: newTodoInfoFromRequest.isPriority,
    isCompleted: newTodoInfoFromRequest.isCompleted
  }

  Todo.findByIdAndUpdate(formatedId, newTodoContent, { new: true })
    .then((updatedTodo) => {
      if (!updatedTodo) return res.status(404).end()
      res.json(updatedTodo)
    })
    .catch((err) => {
      next(err)
    })
})

router.use(notFound)
router.use(handleErrors)

export default router
