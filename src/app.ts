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
  res.send('<h1>Todos API -> Node.js + Express.js + MongoDB + TypeScript</h1>')
})

app.use('/api/todos', todosRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

export { app }
