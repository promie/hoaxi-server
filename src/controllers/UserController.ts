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
    return res.status(httpStatus.BAD_REQUEST)
  }

  res.send()
}

const getUsers = async (req: Request, res: Response, _next: NextFunction) => {
  // @ts-ignore
  const { page, size } = req.pagination

  const content = await UserService.getUsers(page, size)

  return res.status(httpStatus.OK).send(content)
}

export default {
  activate,
  signUp,
  getUsers,
}
