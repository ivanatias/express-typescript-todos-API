import { Model, Schema, Document, model } from 'mongoose'

export interface TodoType extends Document {
  title: string
  date: Date
  isPriority: boolean
  isCompleted: boolean
}

const todoSchema = new Schema<TodoType, Model<TodoType>>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  isPriority: { type: Boolean, required: true },
  isCompleted: { type: Boolean, required: true }
})

todoSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Todo = model('Todo', todoSchema)
