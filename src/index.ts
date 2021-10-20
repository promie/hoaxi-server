import app from './app'
import http from 'http'

const PORT = process.env.PORT || 3000

const startServer = async (): Promise<http.Server> => {
  return app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer()
