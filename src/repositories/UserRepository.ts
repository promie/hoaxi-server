import { Transaction } from 'sequelize/types'
import { User } from '../models'
import { IUser } from '../types/user'
import { InvalidTokenException } from '../exceptions/InvalidTokenException'

const signUp = async (
  userDetails: IUser,
  transaction: Transaction | null | undefined,
) => {
  return User.create(userDetails, { transaction })
}

const findByEmail = (email: string) => {
  return User.findOne({ where: { email } })
}

const activate = async (token: string) => {
  const user = await User.findOne({ where: { activationToken: token } })

  if (!user) {
    // @ts-ignore
    throw new InvalidTokenException()
  }

  // @ts-ignore
  user.inactive = false
  // @ts-ignore
  user.activationToken = null

  // @ts-ignore
  await user.save()
}

export default {
  activate,
  signUp,
  findByEmail,
}
