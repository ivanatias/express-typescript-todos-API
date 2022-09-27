import express from 'express'
import dotenv from 'dotenv'
import './mongo'
import todosRouter from './routes/todos'

dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/ping', (_req, res) => {
  console.log('someone requested something at this endpoint!')
  res.send('PIIIING')
})

app.use('/api/todos', todosRouter)

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
