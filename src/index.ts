import express from 'express'
import dotenv from 'dotenv'
import './mongo'
import todosRouter from './routes/todos'
import usersRouter from './routes/users'
import notFound from './middlewares/not-found'

dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
  console.log('someone requested something at this endpoint!')
  res.send('<h1>Todos API -> Node.js + Express.js + MongoDB + TypeScript</h1>')
})

app.use('/api/todos', todosRouter)
app.use('/api/users', usersRouter)

app.use(notFound)

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
