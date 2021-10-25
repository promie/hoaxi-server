import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

const signUpValidation = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.username === null) {
    return res.status(httpStatus.BAD_REQUEST).send({
      validationErrors: { username: 'Username cannot be null' },
    })
  }

  next()
}

export default signUpValidation
