import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/user'
import notFound from '../middlewares/not-found'
import handleErrors from '../middlewares/handle-errors'

const router = express.Router()

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find({})

    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password, name } = req.body

  if (!username || !password || !name) {
    return res.status(400).send({
      error:
        'Username, password and name are all required fields. Please provide all of them.'
    })
  }

  try {
    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      name,
      username,
      passwordHash
    })

    const savedUser = await newUser.save()

    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

router.use(notFound)
router.use(handleErrors)

export default router
