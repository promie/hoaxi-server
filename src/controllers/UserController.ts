import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  await UserService.signUp(req.body)

  return res.status(httpStatus.OK).json({
    message: req.t('userCreateSuccess'),
  })
}

export default {
  signUp,
}
