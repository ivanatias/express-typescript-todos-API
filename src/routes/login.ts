import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/user'
import notFound from '../middlewares/not-found'
import handleErrors from '../middlewares/handle-errors'

const router = express.Router()

const { JWT_SECRET } = process.env

router.post('/', async (req, res, next) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    const isPasswordCorrect = !user
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordCorrect || !user) {
      return res.status(409).send({
        error: 'Invalid username or password.'
      })
    }

    const userDataForToken = {
      username: user.username,
      id: user._id
    }

    const tokenForUser = jwt.sign(userDataForToken, JWT_SECRET as string, {
      expiresIn: '5d'
    })

    res.send({
      username: user.username,
      name: user.name,
      token: tokenForUser
    })
  } catch (err) {
    next(err)
  }
})

router.use(notFound)
router.use(handleErrors)

export default router
