import { Request, Response } from 'express'
import { Authentication } from '../models/AuthenticationModel'

export const authenticationPage = async (
	request: Request,
	response: Response
): Promise<void> => {
	if (Authentication.user) {
		console.log('user', Authentication.user)

		response.redirect('/')
		return
	}

	response.render('authentication')
	return
}

export const registerUser = async (
	request: Request,
	response: Response
): Promise<void> => {
	const { email, password } = request.body
	const authentication = new Authentication(email, password)

	try {
		if (await authentication.registerUser()) {
			request.flash('success', 'User registered successfully')

			response.redirect('/authentication')

			return
		} else {
			request.flash('errors', Authentication.errors)

			response.redirect('/authentication')
			return
		}
	} catch (error) {
		request.flash('errors', Authentication.errors)
		request.session.save((): void => {
			return response.redirect('back')
		})

		return
	}
}

export const loginUser = async (
	request: Request,
	response: Response
): Promise<void | Error> => {
	try {
		const { email, password } = request.body
		const authentication = new Authentication(email, password)

		if (await authentication.loginUser()) {
			request.flash('success', 'Logged in successfully')

			request.session.save((): void => {
				return response.redirect('back')
			})

			return
		} else {
			request.flash('errors', Authentication.errors)
			request.session.save((): void => {
				return response.redirect('back')
			})
		}
	} catch (error) {
		throw new Error(error)
	}
}

export const logoutUser = async (
	request: Request,
	response: Response
): Promise<boolean | Error> => {
	try {
		const authentication = new Authentication(
			Authentication.user.email,
			Authentication.user.password
		)

		if (await authentication.logoutUser()) {
			request.flash('success', 'Logged out successfully')

			request.session.save((): void => {
				return response.redirect('back')
			})

			return true
		} else {
			request.flash('errors', Authentication.errors)
			request.session.save((): void => {
				return response.redirect('back')
			})

			return false
		}
	} catch (error) {
		throw new Error(error)
	}
}
