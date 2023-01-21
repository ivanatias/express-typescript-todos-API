import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

const { JWT_SECRET } = process.env

export interface ExtractorRequest extends Request {
  userId?: string
}

export interface AuthToken extends JwtPayload {
  id: string
  username: string
}

export default (req: ExtractorRequest, _res: Response, next: NextFunction) => {
  const auth = req.get('Authorization')
  let token = ''

  if (auth && auth.startsWith('Bearer')) {
    token = auth.substring(7)
  }

  const decodedToken = jwt.verify(token, JWT_SECRET as string) as AuthToken

  const { id } = decodedToken

  req.userId = id

  next()
}
