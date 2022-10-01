import { NextFunction, Request, Response } from 'express'

interface ErrorHandlers {
  [key: string]: (res: Response, error?: TypeError) => void
}

const ERROR_HANDLERS: ErrorHandlers = {
  CastError: (res: Response) =>
    res.status(400).send({ error: 'The ID of the Todo is invalid.' }),

  MongoServerError: (res: Response, error?: TypeError) => {
    if (error?.message.startsWith('E11000')) {
      res.status(409).send({
        error: 'This username already exists.'
      })
    }
    res.status(500).end()
  },

  defaultError: (res: Response, error?: TypeError) => {
    console.error(error)
    res.status(500).end()
  }
}

export default (
  error: TypeError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const handlerToUse = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handlerToUse(res, error)
}
