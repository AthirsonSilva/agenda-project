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

export const editPage = async (
	request: Request,
	response: Response
): Promise<void> => {
	try {
		console.log([await Contact.getContactById(request.params.id)])

		const contact = await Contact.getContactById(request.params.id)

		if (!contact) {
			console.log('no contact', contact)
			return response.render('404', { message: 'Contact not found.' })
		}

		response.render('contact', { contact })
	} catch (error) {
		console.log(error)
		response.render('404', { message: 'Contact not found.' })
	}
}

export const editContact = async (
	request: Request,
	response: Response
): Promise<Contact | void | Error> => {
	try {
		const contact = new Contact(request.body)
		const contactExists = await ContactModel.findById(request.params.id)

		if (!contactExists) {
			console.log('no contact', contactExists)
			return response.render('404', { message: 'Contact not found.' })
		}

		const newContact = await Contact.updateContact(
			request.params.id,
			contact
		)

		if (Contact.errors.length > 0) {
			request.flash('errors', Contact.errors)
			request.session.save(() => response.redirect(`/contacts`))
			return newContact
		}

		request.flash('success', 'Contact successfully updated.')

		request.session.save(() => response.redirect(`/`))
		return newContact
	} catch (error) {
		console.log(error)
		response.render('404')
	}
}

export const deleteContact = async (
	request: Request,
	response: Response
): Promise<void | string[] | Error> => {
	try {
		const contact = await Contact.deleteContact(request.params.id)

		if (Contact.errors.length > 0) {
			request.flash('errors', Contact.errors)
			request.session.save(() => response.redirect(`/contacts`))
			return Contact.errors
		}

		request.flash('success', 'Contact successfully deleted.')
		request.session.save(() => response.redirect(`/`))
		return contact
	} catch (error) {
		console.log(error)
		response.render('404')
	}
}
