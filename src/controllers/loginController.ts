import { Request, Response } from 'express'

export const authenticationPage = async (
	request: Request,
	response: Response
): Promise<void> => {
	response.render('authentication')
	return
}
