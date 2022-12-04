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
		if (await authentication.register()) {
			response.send('Registration successful')
			return
		} else {
			response.send('Registration failed' + authentication.errors)
			return
		}
	} catch (error) {
		console.log(error)

		request.flash('errors', authentication.errors)
		request.session.save((): void => {
			return response.redirect('back')
		})

		return
	}
}
