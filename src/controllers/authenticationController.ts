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

	response.send(authentication)
}
