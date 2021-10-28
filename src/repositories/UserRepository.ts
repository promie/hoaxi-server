import { User } from '../models'
import { IUser } from '../types/user'

const signUp = (userDetails: IUser) => {
  return User.create(userDetails)
}

const findByEmail = (email: string) => {
  return User.findOne({ where: { email } })
}

export default {
  signUp,
  findByEmail,
}
