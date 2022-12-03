import { Request, Response } from 'express'

export const homePage = (request: Request, response: Response) => {
	response.render('index')
	return
}
