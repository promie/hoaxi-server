import express from 'express'
import { UserController } from '../controllers'
import { UserService } from '../services'
import { signUpValidationMiddleware } from '../middleware'
import { check } from 'express-validator'

const router = express.Router()

router.post(
  '/',
  check('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 32 characters'),
  check('email')
    .notEmpty()
    .withMessage('E-mail cannot be null')
    .bail()
    .isEmail()
    .withMessage('E-mail is not valid')
    .bail()
    .custom(async email => {
      const user = await UserService.findByEmail(email)

      if (user) {
        throw new Error('E-mail in use')
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password cannot be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      'Password must have at least 1 uppercase, 1 lowercase letter and 1 number',
    ),
  signUpValidationMiddleware,
  UserController.signUp,
)

export default router
