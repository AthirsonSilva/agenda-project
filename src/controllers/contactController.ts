import { Request, Response } from 'express'

export const contactPage = (request: Request, response: Response) => {
	response.render('contacts')
}
