import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex').substring(0, length)
}

const signUp = async (userDetails: IUser) => {
  const { username, email, password } = userDetails

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    username,
    email,
    password: hashedPassword,
    activationToken: generateToken(16),
  }

  return UserRepository.signUp(user)
}

const findByEmail = (email: string) => {
  return UserRepository.findByEmail(email)
}

export default {
  signUp,
  findByEmail,
}
