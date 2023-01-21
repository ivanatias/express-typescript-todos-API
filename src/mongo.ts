import mongoose from 'mongoose'
import { assertNonNullable } from './utils/simple-validators'
import dotenv from 'dotenv'

mongoose.set('strictQuery', true)

dotenv.config()

const { NODE_ENV, MONGODB_URI, MONGODB_URI_TEST } = process.env
const VALID_MONGODB_URI = assertNonNullable<string>(MONGODB_URI)
const VALID_MONGODB_URI_TEST = assertNonNullable<string>(MONGODB_URI_TEST)

const connectionString =
  NODE_ENV === 'test' ? VALID_MONGODB_URI_TEST : VALID_MONGODB_URI

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
