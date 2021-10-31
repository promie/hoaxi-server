import Sequelize from 'sequelize'
import sequelize from '../config/database'

const Model = Sequelize.Model

class User extends Model {}

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
  },
  {
    sequelize,
    modelName: 'user',
  },
)

export default User
