import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    await UserService.signUp(req.body)

    return res.status(httpStatus.OK).json({
      message: req.t('userCreateSuccess'),
    })
  } catch (err) {
    return (
      res
        .status(httpStatus.BAD_GATEWAY)
        // @ts-ignore
        .send({ message: req.t(err.message) })
    )
  }
}

const activate = async (req: Request, res: Response, _next: NextFunction) => {
  const token = req.params.activationToken

  await UserService.activate(token)

  res.send()
}
export default {
  activate,
  signUp,
}
