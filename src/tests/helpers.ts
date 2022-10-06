import { app } from '../index'
import supertest from 'supertest'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const { JWT_SECRET } = process.env

const API = supertest(app)

type ReturnedUser = {
  id: string
  name: string
  username: string
}

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

const dummyUsers = [userWithTodo, userWithNoTodo]

const nonExistentTodoId = new Types.ObjectId()

const newUserInfo = {
  username: 'newuser',
  name: 'New User',
  password: 'password'
}

const incompleteNewUserInfo = {
  username: 'invalidnewuser',
  password: 'invalidpassword'
}

const createAndLoginUser = async (
  name: string,
  username: string,
  password: string,
  id?: Types.ObjectId
) => {
  const newUser = new User({
    name,
    username,
    passwordHash: password,
    _id: id
  })

  await newUser.save()

  const userDataForToken = {
    username: newUser.username,
    id: newUser._id
  }

  const token = jwt.sign(userDataForToken, JWT_SECRET as string)

  return token
}

const extractUsernames = (users: ReturnedUser[]) => {
  return users.map((user) => user.username)
}

export {
  API,
  dummyTodos,
  createAndLoginUser,
  userWithTodo,
  userWithNoTodo,
  nonExistentTodoId,
  dummyUsers,
  newUserInfo,
  incompleteNewUserInfo,
  extractUsernames
}
