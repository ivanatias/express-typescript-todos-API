import mongoose from 'mongoose'
import { server } from '../'
import { User } from '../models/user'
import {
  API,
  dummyUsers,
  newUserInfo,
  incompleteNewUserInfo,
  saveUsersInDB,
  extractUsernames
} from './helpers'

beforeEach(async () => {
  await User.deleteMany({})
  await saveUsersInDB()
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

  test('is not able to create a new user if the username is already taken', async () => {
    const { username, name } = dummyUsers[0]
    const newUser = {
      username,
      password: 'pswd',
      name
    }

    const response = await API.post('/api/users').send(newUser).expect(409)
    expect(response.text).toBe('This username already exists.')

    const { body: users } = await API.get('/api/users')
    expect(users).toHaveLength(dummyUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
