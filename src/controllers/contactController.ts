import { Request, Response } from 'express'
import { Contact, ContactModel } from '../models/ContactModel'

export const contactPage = async (request: Request, response: Response) => {
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
		request.session.save(() => response.redirect(`/`))
	} catch (error) {
		console.log(error)
		response.render('404')
	}
}

export const editIndexPage = async (
	request: Request,
	response: Response
): Promise<void> => {
	console.log(request.params)

	if (!request.params.id || typeof request.params.id !== 'string') {
		console.log('no id')

		response.render('404', {
			message: 'No valid request param was passed.'
		})
		return
	}

	const contact = await ContactModel.findById(request.params.id)

	if (!contact) {
		console.log('no contact', contact)

		response.render('404', { message: 'Contact not found.' })
		return
	}

	response.render('contact', { contact })
}
