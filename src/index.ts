import app from './app'
import http from 'http'
import sequelize from './config/database'
import { Logger } from './utils'

const PORT = process.env.PORT || 3000

sequelize.sync({ force: true })

const startServer = async (): Promise<http.Server> => {
  return app.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`)
  })
}

startServer()
