import mongoose from 'mongoose'
import validator from 'validator'

const ContactSchema = new mongoose.Schema({
	name: { type: String, required: true },
	surname: { type: String, required: true },
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

	public validateEmail = async (): Promise<boolean> => {
		this.cleanErrors()

		if (!this.email) {
			Contact.errors.push('Email is required')

			return false
		} else if (!validator.isEmail(this.email)) {
			Contact.errors.push('Invalid email validator')

			return false
		}

		return true
	}

	public validatePhone = async (): Promise<boolean> => {
		this.cleanErrors()

		if (!this.phone) {
			Contact.errors.push('Phone is required')

			return false
		} else if (!validator.isMobilePhone(this.phone)) {
			Contact.errors.push('Invalid phone validator')

			return false
		}

		return true
	}

	public validateName = async (): Promise<boolean> => {
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
	}

	public validateSurname = async (): Promise<boolean> => {
		this.cleanErrors()

		if (!this.surname) {
			Contact.errors.push('Surname is required')

			return false
		} else if (!validator.isAlpha(this.surname)) {
			Contact.errors.push('Invalid surname validator')

			return false
		} else if (this.surname.length < 3 || this.surname.length > 20) {
			Contact.errors.push('Surname must be between 3 and 20 characters')

			return false
		}

		return true
	}

	public validateData = async (): Promise<boolean> => {
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
	}

	public register = async (): Promise<void> => {
		this.cleanErrors()

		if (!(await this.validateData())) {
			return
		}

		await ContactModel.create({
			name: this.name,
			surname: this.surname,
			email: this.email,
			phone: this.phone
		})
	}

	public static getContacts = async (): Promise<IContact[]> => {
		return await ContactModel.find().sort({ createdAt: -1 })
	}

	public static getContactBySearch = async (
		search: string
	): Promise<IContact[]> => {
		return await ContactModel.find({
			$or: [
				{ name: { $regex: search, $options: 'i' } },
				{ surname: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
				{ phone: { $regex: search, $options: 'i' } }
			]
		})
	}
}
