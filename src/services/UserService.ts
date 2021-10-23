import { UserRepository } from '../repositories'
import { IUser } from '../types/user'
import bcrypt from 'bcrypt'

const signUp = async (userDetails: IUser) => {
  console.log('userDetails', userDetails)

  const hashedPassword = await bcrypt.hash(userDetails.password, 10)

  const user = {
    username: userDetails.username,
    email: userDetails.email,
    password: hashedPassword,
  }

  return UserRepository.signUp(user)
}

export default {
  signUp,
}
