import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { EmailService } from './index'
import sequelize from '../config/database'
import { EmailException } from '../exceptions/EmailException'

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

  const transaction = await sequelize.transaction()

  const newUser = await UserRepository.signUp(user, transaction)

  try {
    await EmailService.sendAccountActivation(email, token)
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    // @ts-ignore
    throw new EmailException()
  }

  return newUser
}

const findByEmail = (email: string) => {
  return UserRepository.findByEmail(email)
}

const activate = (token: string) => {
  return UserRepository.activate(token)
}

export default {
  activate,
  signUp,
  findByEmail,
}
