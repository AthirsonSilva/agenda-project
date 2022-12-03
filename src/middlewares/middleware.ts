import { NextFunction, Request, Response } from 'express'

export const middlewareGlobal = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	response.locals.localVariable = 'Local variable value.'
	next()
}

export const anotherMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	next()
}

export const checkCsrfError = (
	err: any,
	request: Request,
	response: Response,
	next: NextFunction
) => {
	if (err) {
		return response.render('404')
	}
}

export const csrfMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	response.locals.csrfToken = request.csrfToken()
	next()
}
