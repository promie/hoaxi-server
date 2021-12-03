import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import { morganMiddleware } from './middleware'
import { UserRoute } from './routes'
import errorHandler from './error/ErrorHandler'

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      lookupHeader: 'accept-language',
    },
  })

const app: Application = express()

app.use(middleware.handle(i18next))
app.use(express.json())
app.use(cors())
app.use(morganMiddleware)

app.use('/api/1.0/users', UserRoute)
app.use(errorHandler)

// Handling Unhandled Routes
app.all('*', (req: Request, res: Response, _next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    error: `Can't find ${req.originalUrl} on this server`,
  })
})

export default app
