import mongoose from 'mongoose'
import { server } from '../index'
import { User } from '../models/user'
import { API, newUserInfo, incompleteNewUserInfo } from './helpers'

beforeAll(async () => {
  await User.deleteMany({})
  await API.post('/api/users').send(newUserInfo)
})

describe('POST login', () => {
  test('an existing user is able to log in if correct password is provided', async () => {
    const credentials = {
      username: newUserInfo.username,
      password: newUserInfo.password
    }

    await API.post('/api/login').send(credentials).expect(200)
  })

  test('an existing user is not able to log in if incorrect password is provided', async () => {
    const credentials = {
      username: newUserInfo.username,
      password: 'incorrectpassword'
    }

    await API.post('/api/login').send(credentials).expect(409)
  })

  test('non existent user is not able to log in', async () => {
    const credentials = {
      username: incompleteNewUserInfo.username,
      password: incompleteNewUserInfo.password
    }

    await API.post('/api/login').send(credentials).expect(409)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
