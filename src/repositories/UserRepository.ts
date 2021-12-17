import { Transaction } from 'sequelize/types'
import { User } from '../models'
import { IUser } from '../types/user'

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
  const user: any = await User.findOne({ where: { activationToken: token } })

  user.inactive = false
  user.activationToken = null

  await user.save()
}

const getUsers = async (page: number) => {
  const pageSize = 10
  const usersWithCount = await User.findAndCountAll({
    where: { inactive: false },
    attributes: ['id', 'username', 'email'],
    limit: pageSize,
    offset: page * pageSize,
  })

  return {
    content: usersWithCount.rows,
    page,
    size: 10,
    totalPages: Math.ceil(usersWithCount.count / pageSize),
  }
}

export default {
  activate,
  signUp,
  findByEmail,
  getUsers,
}
