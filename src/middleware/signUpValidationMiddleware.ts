// @ts-nocheck
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { validationResult } from 'express-validator'

const signUpValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const validationErrors = {}

    errors
      .array()
      .forEach(error => (validationErrors[error.param] = req.t(error.msg)))

    return res.status(httpStatus.BAD_REQUEST).send({ validationErrors })
  }

  next()
}

export default signUpValidationMiddleware
