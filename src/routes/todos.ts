import express from 'express'
import * as todosServices from '../services/service.todos'
import toNewTodo from '../utils/check-new-todo'

const router = express.Router()

router.get('/', (_req, res) => {
  res.send(todosServices.getTodos())
})

router.post('/deleteTodo', (req, res) => {
  if (req.method !== 'POST') res.status(405).end()

  const todoToDelete = req.body
  let todoDeleted

  if (todoToDelete) {
    todoDeleted = todosServices.deleteTodo(todoToDelete)
  }

  todoDeleted ? res.send(todosServices.getTodos()) : res.status(404).end()
})

router.post('/', (req, res) => {
  try {
    const newTodo = toNewTodo(req.body)

    const addedNewTodo = todosServices.addTodo(newTodo)

    res.json(addedNewTodo)
  } catch (error) {
    if (error instanceof Error) res.status(400).send(error.message)
    console.log('Unexpected Error', error)
  }
})

export default router
