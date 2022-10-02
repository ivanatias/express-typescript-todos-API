import { NextFunction, Request, Response } from 'express'

interface ErrorHandlers {
  [key: string]: (res: Response, error?: Error) => void
}

const ERROR_HANDLERS: ErrorHandlers = {
  CastError: (res: Response) =>
    res.status(400).send({ error: 'The ID of the Todo is invalid.' }),

  MongoServerError: (res: Response, error?: Error) => {
    if (error?.message.startsWith('E11000')) {
      res.status(409).send({
        error: 'This username already exists.'
      })
    }
    res.status(500).end()
  },

  JsonWebTokenError: (res: Response) =>
    res.status(401).send({
      error: 'The authorization token is missing or is invalid.'
    }),

  TokenExpiredError: (res: Response) =>
    res.status(401).send({
      error: 'The authorization token has expired.'
    }),

  defaultError: (res: Response, error?: Error) => {
    console.error(error)
    res.status(500).end()
  }
}

export default (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const handlerToUse = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handlerToUse(res, error)
}
