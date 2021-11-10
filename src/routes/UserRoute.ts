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
    .withMessage('usernameNull')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('usernameSize'),
  check('email')
    .notEmpty()
    .withMessage('emailNull')
    .bail()
    .isEmail()
    .withMessage('emailInvalid')
    .bail()
    .custom(async email => {
      const user = await UserService.findByEmail(email)

      if (user) {
        throw new Error('emailInUse')
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('passwordNull')
    .bail()
    .isLength({ min: 6 })
    .withMessage('passwordSize')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('passwordPattern'),
  signUpValidationMiddleware,
  UserController.signUp,
)

router.post('/token/:activationToken', UserController.activate)

export default router
