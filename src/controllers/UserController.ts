import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { UserService } from '../services'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.signUp(req.body)

    return res.status(httpStatus.OK).json({
      message: req.t('userCreateSuccess'),
    })
  } catch (err) {
    next(err)
  }
}

const activate = async (req: Request, res: Response, _next: NextFunction) => {
  const token = req.params.activationToken
  try {
    await UserService.activate(token)
  } catch (err) {
    return res.status(400)
  }

  res.send()
}

const getUsers = async (req: Request, res: Response, _next: NextFunction) => {
  const users = await UserService.getUsers()

  return res.status(200).send(users)
}

export default {
  activate,
  signUp,
  getUsers,
}
