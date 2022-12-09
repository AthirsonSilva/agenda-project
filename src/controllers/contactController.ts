import { Request, Response } from 'express'
import { Contact } from '../models/ContactModel'

export const contactPage = (request: Request, response: Response) => {
	response.render('contacts')
}

export const registerContact = async (request: Request, response: Response) => {
	try {
		const contact = new Contact(request.body)
		await contact.register()

		if (Contact.errors.length > 0) {
			request.flash('errors', Contact.errors)
			request.session.save(() => response.redirect(`/contacts`))
			return
		}

		request.flash('success', 'Contact successfully registered.')
		request.session.save(() =>
			response.redirect(`/contacts/${contact._id}`)
		)
	} catch (error) {
		console.log(error)
		response.render('404')
	}
}
