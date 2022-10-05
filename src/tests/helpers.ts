import { app } from '../index'
import supertest from 'supertest'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const { JWT_SECRET } = process.env

const API = supertest(app)

const userWithNoTodo = {
  name: 'User with no todo',
  username: 'userwithnotodo',
  passwordHash: 'test'
}

const userWithTodo = {
  name: 'User with todo',
  username: 'userwithtodo',
  passwordHash: 'test',
  _id: new Types.ObjectId()
}

const dummyTodos = [
  {
    title: 'This is the first dummy todo',
    isPriority: true,
    isCompleted: false,
    date: new Date()
  },
  {
    title: 'This todo should be deleted',
    isPriority: true,
    isCompleted: false,
    date: new Date(),
    user: userWithTodo._id
  },
  {
    title: 'This todo should be updated',
    isPriority: true,
    isCompleted: false,
    date: new Date(),
    user: userWithTodo._id
  },
  {
    title: 'This todo should not be deleted',
    isPriority: true,
    isCompleted: false,
    date: new Date(),
    user: userWithTodo._id
  }
]

const provideTokenToUser = (username: string, id: string) => {
  const userDataForToken = {
    username,
    id
  }

  const tokenForUser = jwt.sign(userDataForToken, JWT_SECRET as string)

  return tokenForUser
}

const createAndSaveTestUser = async (
  name: string,
  username: string,
  password: string,
  id?: Types.ObjectId
) => {
  const newTestUser = new User({
    name,
    username,
    passwordHash: password,
    _id: id
  })

  await newTestUser.save()

  return newTestUser
}

export {
  API,
  dummyTodos,
  provideTokenToUser,
  createAndSaveTestUser,
  userWithTodo,
  userWithNoTodo
}
