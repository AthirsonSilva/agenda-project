import { NextFunction, Request, Response } from 'express'

export const middlewareGlobal = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	response.locals.errors = request.flash('errors')

	console.log('Passed by this middleware', [
		request.method,
		request.path,
		request.hostname,
		request.protocol,
		request.statusCode,
		response.locals.errors
	])

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
	request: any,
	response: Response,
	next: NextFunction
) => {
	response.locals.csrfToken = request.csrfToken()
	next()
}
