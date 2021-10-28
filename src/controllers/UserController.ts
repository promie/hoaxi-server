import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    await UserService.signUp(req.body)

    return res.status(httpStatus.OK).json({
      message: 'User created',
    })
  } catch (err) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ validationErrors: { email: 'E-mail in use' } })
  }
}

export default {
  signUp,
}
