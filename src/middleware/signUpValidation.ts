import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

const validateUsername = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.username === null) {
    return res.status(httpStatus.BAD_REQUEST).send({
      validationErrors: { username: 'Username cannot be null' },
    })
  }

  next()
}

const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email === null) {
    return res.status(httpStatus.BAD_REQUEST).send({
      validationErrors: { email: 'E-mail cannot be null' },
    })
  }

  next()
}

export default { validateUsername, validateEmail }
