import { Request, Response } from 'express'
import { Authentication } from '../models/AuthenticationModel'

export const authenticationPage = async (
	request: Request,
	response: Response
): Promise<void> => {
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
			console.log(Authentication.errors)
			request.flash('errors', Authentication.errors)

			response.redirect('/authentication')
			return
		}
	} catch (error) {
		console.log(Authentication.errors)

		request.flash('errors', Authentication.errors)
		request.session.save((): void => {
			return response.redirect('back')
		})

		return
	}
}
