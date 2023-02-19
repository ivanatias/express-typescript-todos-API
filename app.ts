import express from 'express'
import cors from 'cors'
import { connectDB } from './mongo'
import todosRouter from './routes/todos'
import usersRouter from './routes/users'
import loginRouter from './routes/login'
import notFound from './middlewares/not-found'

connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (_req, res) => {
  console.log('someone requested something at this endpoint!')
  res.json([
    {
      endpoint: '/api/todos',
      options: [
        {
          method: 'GET',
          parameters: [
            {
              name: 'all todos',
              endpoint: '/',
              description: 'Returns all todos from all users',
              authentication: false
            },
            {
              name: 'user todos',
              endpoint: '/usertodos',
              description: 'Returns all todos from a user',
              authentication: true
            },
            {
              name: 'todo',
              endpoint: '/:id',
              description: 'Returns a todo by its id',
              authentication: false
            }
          ]
        },
        {
          method: 'DELETE',
          parameters: [
            {
              name: 'delete todo',
              endpoint: '/:id',
              description: 'Finds a todo by its id and deletes it',
              authentication: true
            }
          ]
        },
        {
          method: 'POST',
          parameters: [
            {
              name: 'create todo',
              endpoint: '/',
              description: 'Creates and returns a new todo',
              authentication: true
            }
          ]
        },
        {
          method: 'PUT',
          parameters: [
            {
              name: 'modify todo',
              endpoint: '/:id',
              description: 'Finds a todo by its id and modifies it',
              authentication: true
            }
          ]
        }
      ]
    },
    {
      endpoint: '/api/users',
      options: [
        {
          method: 'GET',
          parameters: [
            {
              name: 'all users',
              endpoint: '/',
              description: 'Returns all users',
              authentication: false
            }
          ]
        },
        {
          method: 'POST',
          parameters: [
            {
              name: 'create user',
              endpoint: '/',
              description: 'Creates and returns a new user',
              authentication: false
            }
          ]
        }
      ]
    },
    {
      endpoint: '/api/login',
      options: [
        {
          method: 'POST',
          parameters: [
            {
              name: 'login',
              endpoint: '/',
              description: 'Logs in a user by providing a session token',
              authentication: false
            }
          ]
        }
      ]
    }
  ])
})

app.use('/api/todos', todosRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

export { app }
