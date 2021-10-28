import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'

const signUp = async (userDetails: IUser) => {
  const hashedPassword = await bcrypt.hash(userDetails.password, 10)

  const user = {
    ...userDetails,
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
