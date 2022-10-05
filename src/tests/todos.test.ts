import mongoose from 'mongoose'
import { server } from '../index'
import { Todo } from '../models/todo'
import { User } from '../models/user'
import {
  API,
  dummyTodos,
  userWithTodo,
  provideTokenToUser,
  createAndSaveTestUser,
  userWithNoTodo
} from './helpers'

beforeEach(async () => {
  await Todo.deleteMany({})
  await User.deleteMany({})

  for (const todo of dummyTodos) {
    const todoObject = new Todo(todo)
    await todoObject.save()
  }
})

describe('GET all todos', () => {
  test('the todos are returned as JSON', async () => {
    await API.get('/api/todos')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are four todos', async () => {
    const response = await API.get('/api/todos')
    expect(response.body).toHaveLength(dummyTodos.length)
  })
})

describe('GET a todo', () => {
  test('is able to retrieve the first todo providing a valid id', async () => {
    const firstTodo = await Todo.findOne({ title: dummyTodos[0].title })

    await API.get(`/api/todos/${firstTodo?._id}`).expect(200)
  })

  test('is not possible to retrieve a todo providing an invalid id', async () => {
    await API.get('/api/todos/1234567890').expect(400)
  })

  test('is not possible to retrieve a todo that does not exist providing a valid id', async () => {
    await API.get('/api/todos/633b59a165510680300479be').expect(404)
  })
})

describe('DELETE todo', () => {
  test('a logged in user is able to delete his/her own todo', async () => {
    const { name, username, passwordHash, _id } = userWithTodo
    const user = await createAndSaveTestUser(name, username, passwordHash, _id)

    const todoToDelete = await Todo.findOne({
      title: 'This todo should be deleted'
    })

    const tokenForUser = provideTokenToUser(user.username, user._id)

    await API.delete(`/api/todos/${todoToDelete?._id}`)
      .set('Authorization', `Bearer ${tokenForUser}`)
      .expect(204)

    const response = await API.get('/api/todos')
    expect(response.body).toHaveLength(dummyTodos.length - 1)
  })

  test('a logged in user should not be able to delete a todo that he/she does not own', async () => {
    const { name, username, passwordHash } = userWithNoTodo
    const user = await createAndSaveTestUser(name, username, passwordHash)

    const todoToDelete = await Todo.findOne({
      title: 'This todo should not be deleted'
    })

    const tokenForUser = provideTokenToUser(user.username, user._id)

    await API.delete(`/api/todos/${todoToDelete?._id}`)
      .set('Authorization', `Bearer ${tokenForUser}`)
      .expect(401)

    const response = await API.get('/api/todos')
    expect(response.body).toHaveLength(dummyTodos.length)
  })

  test('not logged in user should get a 401', async () => {
    const todoToDelete = await Todo.findOne({
      title: 'This todo should not be deleted'
    })

    await API.delete(`/api/todos/${todoToDelete?._id}`).expect(401)
  })
})

describe('PUT todo', () => {
  test('a logged in user is able to update his/her own todo', async () => {
    const { name, username, passwordHash, _id } = userWithTodo
    const user = await createAndSaveTestUser(name, username, passwordHash, _id)

    const tokenForUser = provideTokenToUser(user.username, user._id)

    const todoToUpdate = await Todo.findOne({
      title: 'This todo should be updated'
    })

    const newContent = {
      title: 'UPDATED!'
    }

    const response = await API.put(`/api/todos/${todoToUpdate?._id}`)
      .set('Authorization', `Bearer ${tokenForUser}`)
      .send(newContent)
      .expect(200)
    expect(response.body.title).toContain(newContent.title)
  })
})

describe('POST todo', () => {
  test('a logged in user can create a new todo', async () => {
    const { name, username, passwordHash } = userWithNoTodo
    const user = await createAndSaveTestUser(name, username, passwordHash)

    const tokenForUser = provideTokenToUser(user.username, user._id)

    const newTodo = {
      title: 'This is a fresh, new todo',
      isPriority: true
    }

    await API.post('/api/todos')
      .set('Authorization', `Bearer ${tokenForUser}`)
      .send(newTodo)
      .expect(200)
    const response = await API.get('/api/todos')
    expect(response.body).toHaveLength(dummyTodos.length + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
