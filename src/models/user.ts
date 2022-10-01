import { Model, Schema, Document, model, Types } from 'mongoose'
import { TodoType } from './todo'

interface UserType extends Document {
  name: string
  username: string
  passwordHash: string
  todos: Types.Array<TodoType>
}

const userSchema = new Schema<UserType, Model<UserType>>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  todos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Todo'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

export const User = model('User', userSchema)
