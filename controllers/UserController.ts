import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

const signUp = (req: Request, res: Response, _next: NextFunction) => {
  return res.status(httpStatus.OK).json({
    response: 'HELLO',
  })
}

export default {
  signUp,
}
