import express from 'express'
import { UserController } from '../controllers'
import { signUpValidation } from '../middleware'

const router = express.Router()

router.post('/', signUpValidation, UserController.signUp)

export default router
