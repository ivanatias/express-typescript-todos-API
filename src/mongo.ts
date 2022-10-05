import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const { NODE_ENV, MONGODB_URI, MONGODB_URI_TEST } = process.env

const connectionString =
  NODE_ENV === 'test' ? (MONGODB_URI_TEST as string) : (MONGODB_URI as string)

const connectDB = () => {
  mongoose
    .connect(connectionString)
    .then(() => {
      console.log('Connected to Database')
    })
    .catch((error) => {
      console.error(error)
    })
}

export { connectDB }
