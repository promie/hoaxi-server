import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  if (req.body.username === null) {
    return res.status(httpStatus.BAD_REQUEST).send({
      validationErrors: { username: 'Username cannot be null' },
    })
  }

  await UserService.signUp(req.body)

  return res.status(httpStatus.OK).json({
    message: 'User created',
  })
}

export default {
  signUp,
}
