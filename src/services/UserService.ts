import { UserRepository } from '../repositories'
import { IUser } from '../types/user'

const signUp = (userDetails: IUser) => {
  return UserRepository.signUp(userDetails)
}

export default {
  signUp,
}
