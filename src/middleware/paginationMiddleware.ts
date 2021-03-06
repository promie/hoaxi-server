import { Request, Response, NextFunction } from 'express'

const paginationMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const pageAsNumber = Number.parseInt(req.query.page as string)
  const sizeAsNumber = Number.parseInt(req.query.size as string)

  let page = Number.isNaN(pageAsNumber) ? 0 : pageAsNumber

  if (page < 0) {
    page = 0
  }

  let size = Number.isNaN(sizeAsNumber) ? 10 : sizeAsNumber

  if (size > 10 || size < 1) {
    size = 10
  }

  // @ts-ignore
  req.pagination = { size, page }
  next()
}

export default paginationMiddleware
