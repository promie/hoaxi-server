import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { User } from '../models'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  await User.create(req.body)

  return res.status(httpStatus.OK).json({
    message: 'User created',
  })
}

export default {
  signUp,
}
