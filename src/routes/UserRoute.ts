import express from 'express'
import { UserController } from '../controllers'
import { signUpValidationMiddleware } from '../middleware'
import { check } from 'express-validator'

const router = express.Router()

router.post(
  '/',
  check('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4 })
    .withMessage('Must have min 4 and max 32 characters'),
  check('email').notEmpty().withMessage('E-mail cannot be null'),
  check('password').notEmpty().withMessage('Password cannot be null'),
  signUpValidationMiddleware,
  UserController.signUp,
)

export default router
