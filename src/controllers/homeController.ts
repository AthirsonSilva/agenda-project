import { Request, Response } from 'express'

export const homePage = (request: Request, response: Response) => {
	response.render('index', {
		titulo: 'Este será o título da página',
		numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
	})
	return
}

export const verifyPost = (request: Request, response: Response) => {
	response.send(request.body)
	return
}
