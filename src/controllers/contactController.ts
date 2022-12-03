import { Request, Response } from 'express'

export const contactPage = (request: Request, response: Response) => {
	response.send('Thank you for your attention.')
}
