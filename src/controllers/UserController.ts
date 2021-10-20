import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

const signUp = (req: Request, res: Response, _next: NextFunction) => {
  return res.status(httpStatus.OK).json({
    message: 'User created',
  })
}

export default {
  signUp,
}
