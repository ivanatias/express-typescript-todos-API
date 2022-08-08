import express from 'express'
import todosRouter from './routes/todos'

const app = express()
app.use(express.json())

const PORT = 3001

app.get('/ping', (_req, res) => {
  console.log('someone requested something at this endpoint!')
  res.send('PIIIING')
})

app.use('/api/todos', todosRouter)

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
