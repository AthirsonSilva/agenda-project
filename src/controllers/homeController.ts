import { Request, Response } from 'express'
import { Contact } from '../models/ContactModel'

export const homePage = async (request: Request, response: Response) => {
	if (!response.locals.user) {
		console.log('no user', response.locals.user)
		response.render('index', { contacts: [] })
		return
	}

	const contacts = await Contact.getContactByUserId(response.locals.user._id)

	if (!contacts) {
		console.log('no contacts', contacts)
		response.render('index', { contacts: [] })
		return
	}

	console.log('contacts', [
		contacts,
		response.locals.user._id,
		response.locals.user.id
	])
	response.render('index', { contacts })
	return
}

export const testing = async (
	request: Request,
	response: Response
): Promise<any> => {
	return await Contact.find({
		where: { user_id: '639333aa6bae9f7c8c733099' }
	})
}
