import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { EmailService } from './index'

const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex').substring(0, length)
}

const signUp = async (userDetails: IUser) => {
  const { username, email, password } = userDetails

  const hashedPassword = await bcrypt.hash(password, 10)
  const token = generateToken(16)

  const user = {
    username,
    email,
    password: hashedPassword,
    activationToken: token,
  }

  const newUser = await UserRepository.signUp(user)

  await EmailService.sendAccountActivation(email, token)

  return newUser
}

const findByEmail = (email: string) => {
  return UserRepository.findByEmail(email)
}

export default {
  signUp,
  findByEmail,
}
