import mongoose from 'mongoose'
import validator from 'validator'
import { Authentication } from './AuthenticationModel'

const ContactSchema = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
	user_id: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
})

export const ContactModel = mongoose.model('Contact', ContactSchema)

interface IContact {
	name: string
	surname: string
	email: string
	phone: string
}

export class Contact extends ContactModel implements IContact {
	private _name: string
	private _surname: string
	private _email: string
	private _phone: string
	private _created_at: Date
	private _updated_at: Date
	private contact: any
	public static errors: string[] = []

	public get name(): string {
		return this._name
	}
	public set name(value: string) {
		this._name = value
	}
	public get surname(): string {
		return this._surname
	}
	public set surname(value: string) {
		this._surname = value
	}
	public get email(): string {
		return this._email
	}
	public set email(value: string) {
		this._email = value
	}
	public get phone(): string {
		return this._phone
	}
	public set phone(value: string) {
		this._phone = value
	}

	constructor(body: IContact) {
		super()

		this.name = body.name
		this.surname = body.surname
		this.email = body.email
		this.phone = body.phone
	}

	private cleanErrors = (): void => {
		Contact.errors.splice(0, Contact.errors.length)
	}

	public validateEmail = async (): Promise<boolean | Error> => {
		try {
			this.cleanErrors()

			if (!this.email) {
				Contact.errors.push('Email is required')

				return false
			} else if (!validator.isEmail(this.email)) {
				Contact.errors.push('Invalid email validator')

				return false
			}

			return true
		} catch (error) {
			return new Error(error)
		}
	}

	public validatePhone = async (): Promise<boolean | Error> => {
		try {
			this.cleanErrors()

			if (!this.phone) {
				Contact.errors.push('Phone is required')

				return false
			} else if (!validator.isMobilePhone(this.phone)) {
				Contact.errors.push('Invalid phone validator')

				return false
			}

			return true
		} catch (error) {
			return new Error(error)
		}
	}

	public validateName = async (): Promise<boolean | Error> => {
		try {
			this.cleanErrors()

			if (!this.name) {
				Contact.errors.push('Name is required')

				return false
			} else if (!validator.isAlpha(this.name)) {
				Contact.errors.push('Invalid name validator')

				return false
			} else if (this.name.length < 3 || this.name.length > 20) {
				Contact.errors.push('Name must be between 3 and 20 characters')

				return false
			}

			return true
		} catch (error) {
			return new Error(error)
		}
	}

	public validateSurname = async (): Promise<boolean | Error> => {
		try {
			this.cleanErrors()

			if (!this.surname) {
				Contact.errors.push('Surname is required')

				return false
			} else if (!validator.isAlpha(this.surname)) {
				Contact.errors.push('Invalid surname validator')

				return false
			} else if (this.surname.length < 3 || this.surname.length > 20) {
				Contact.errors.push(
					'Surname must be between 3 and 20 characters'
				)

				return false
			}

			return true
		} catch (error) {
			return new Error(error)
		}
	}

	public validateData = async (): Promise<boolean | Error> => {
		try {
			this.cleanErrors()

			if (!(await this.validateEmail())) {
				return false
			} else if (!(await this.validatePhone())) {
				return false
			} else if (!(await this.validateName())) {
				return false
			} else if (!(await this.validateSurname())) {
				return false
			}

			return true
		} catch (error) {
			return new Error(error)
		}
	}

	public register = async (): Promise<void | Error> => {
		try {
			this.cleanErrors()

			if (!(await this.validateData())) {
				return
			}

			await ContactModel.create({
				name: this.name,
				user_id: Authentication.user._id,
				surname: this.surname,
				email: this.email,
				phone: this.phone
			})
		} catch (error) {
			return new Error(error)
		}
	}

	public static getContacts = async (): Promise<Contact[]> => {
		return await ContactModel.find().sort({ created_at: -1 })
	}

	public static getContactBySearch = async (
		search: string
	): Promise<IContact[] | Error> => {
		try {
			return await ContactModel.find({
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ surname: { $regex: search, $options: 'i' } },
					{ email: { $regex: search, $options: 'i' } },
					{ phone: { $regex: search, $options: 'i' } }
				]
			})
		} catch (error) {
			return new Error(error)
		}
	}

	public static getContactById = async (
		id: string
	): Promise<Contact | Error> => {
		try {
			return await ContactModel.findById(id)
		} catch (error) {
			return new Error(error)
		}
	}

	public static getContactByUserId = async (
		id: string
	): Promise<Contact[] | Error> => {
		try {
			return (await Contact.findById(id)) || (await ContactModel.find())
		} catch (error) {
			return new Error(error)
		}
	}

	public static deleteContact = async (id: string): Promise<void | Error> => {
		try {
			const deletedContact = await ContactModel.findByIdAndDelete(id)

			if (!deletedContact) {
				return new Error('Contact not found')
			}

			return deletedContact
		} catch (error) {
			return new Error(error)
		}
	}

	public static updateContact = async (
		id: string,
		data: IContact
	): Promise<void | Error> => {
		try {
			const contactToBeUpdated = await ContactModel.findById(id)

			if (!contactToBeUpdated) {
				return
			}

			const updated = await ContactModel.updateOne(
				{
					_id: id
				},
				{
					$set: {
						name: data.name,
						surname: data.surname,
						email: data.email,
						phone: data.phone
					}
				}
			)
		} catch (error) {
			return new Error(error)
		}
	}
}
