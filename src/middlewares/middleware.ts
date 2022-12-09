import { NextFunction, Request, Response } from 'express'
import { Authentication } from './../models/AuthenticationModel'

export const middlewareGlobal = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	response.locals.errors = request.flash('errors')
	response.locals.success = request.flash('success')
	response.locals.info = request.flash('info')
	response.locals.user = Authentication.user

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

export const loginRequired = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	if (!response.locals.user) {
		request.flash('errors', 'You must be logged in to access this page.')
		request.session.save(() => response.redirect('/'))

		return
	}

	next()
}
