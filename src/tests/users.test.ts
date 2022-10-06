import mongoose from 'mongoose'
import { server } from '../index'
import { User } from '../models/user'
import {
  API,
  dummyUsers,
  newUserInfo,
  incompleteNewUserInfo,
  extractUsernames
} from './helpers'

beforeAll(async () => {
  await User.deleteMany({})

  for (const user of dummyUsers) {
    const userObject = new User(user)
    await userObject.save()
  }
})

describe('GET users', () => {
  test('users are returned as JSON', async () => {
    await API.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('POST users', () => {
  test('is able to create a new user', async () => {
    const { body: newCreatedUser } = await API.post('/api/users')
      .send(newUserInfo)
      .expect(201)
    const { body: users } = await API.get('/api/users')

    const usersUsernames = extractUsernames(users)

    expect(users).toHaveLength(dummyUsers.length + 1)
    expect(usersUsernames).toContain(newCreatedUser.username)
  })

  test('is not able to create a new user if one of the required fields is missing', async () => {
    await API.post('/api/users').send(incompleteNewUserInfo).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
