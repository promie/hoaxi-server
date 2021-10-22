import { User } from '../models'
import { IUser } from '../types/user'

const signUp = (userDetails: IUser) => {
  return User.create(userDetails)
}

export default {
  signUp,
}
