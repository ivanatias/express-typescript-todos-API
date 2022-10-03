import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectionString =
  process.env.NODE_ENV === 'test'
    ? (process.env.MONGODB_URI_TEST as string)
    : (process.env.MONGODB_URI as string)

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to Database')
  })
  .catch((error) => {
    console.error(error)
  })

process.on('uncaughtException', (error) => {
  console.error(error)
  mongoose.disconnect()
})
