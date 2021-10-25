import express from 'express'
import { UserController } from '../controllers'
import { signUpValidation } from '../middleware'

const router = express.Router()

router.post(
  '/',
  signUpValidation.validateUsername,
  signUpValidation.validateEmail,
  UserController.signUp,
)

export default router
