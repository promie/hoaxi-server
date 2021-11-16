import Sequelize from 'sequelize'
import sequelize from '../config/database'
import { IUser } from '../types/user'

const Model = Sequelize.Model

class User extends Model<IUser> {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    inactive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    activationToken: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize,
    modelName: 'user',
  },
)

export default User
