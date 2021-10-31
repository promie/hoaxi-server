import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'

const signUp = async (userDetails: IUser) => {
  const { username, email, password } = userDetails

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    username,
    email,
    password: hashedPassword,
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
