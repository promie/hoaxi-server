import { Request, Response, NextFunction } from 'express'

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const { status, message } = err

  // @ts-ignore
  return res.status(status).send({ message: req.t(message) })
}

export default ErrorHandler
