import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  const user = await UserService.signUp(req.body)

  // @ts-ignore
  if (user.username === null) {
    return res.status(httpStatus.BAD_REQUEST).send()
  }

  return res.status(httpStatus.OK).json({
    message: 'User created',
  })
}

export default {
  signUp,
}
