import { app } from '../index'
import supertest from 'supertest'
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
  _id: '633b59a165510680300479be'
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
    user: '633b59a165510680300479be'
  },
  {
    title: 'This todo should be updated',
    isPriority: true,
    isCompleted: false,
    date: new Date(),
    user: '633b59a165510680300479be'
  },
  {
    title: 'This todo should not be deleted',
    isPriority: true,
    isCompleted: false,
    date: new Date(),
    user: '633b59a165510680300479be'
  }
]

const provideTokenToUser = (
  username: string | undefined,
  id: string | undefined
) => {
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
  id?: string
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
