import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './mongo'
import todosRouter from './routes/todos'
import usersRouter from './routes/users'
import loginRouter from './routes/login'
import notFound from './middlewares/not-found'

dotenv.config()
connectDB()

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
  console.log('someone requested something at this endpoint!')
  res.send('<h1>Todos API -> Node.js + Express.js + MongoDB + TypeScript</h1>')
})

app.use('/api/todos', todosRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(notFound)

const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

export { app, server }
