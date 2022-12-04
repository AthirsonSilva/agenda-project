import mongoose from 'mongoose'

const AuthenticationSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true }
})

const AuthenticationModel = mongoose.model(
	'Authentication',
	AuthenticationSchema
)

interface IAuthentication {
	email: string
	password: string
}

export class Authentication implements IAuthentication {
	private _email: string
	private _password: string
	public errors: any[] = new Array([])

	constructor(email: string, password: string) {
		this.email = email
		this.password = password
	}

	public get email(): string {
		return this._email
	}
	public set email(value: string) {
		this._email = value
	}

	public get password(): string {
		return this._password
	}
	public set password(value: string) {
		this._password = value
	}

	private cleanErrors = (): void => {
		this.errors.splice(0, this.errors.length)
	}

	public validateEmail = async (): Promise<boolean> => {
		const emailConditions = ['@', '.']
		this.cleanErrors()

		if (!this.email) {
			this.errors.push('Email is required')
		} else if (typeof this.email !== 'string') {
			this.errors.push('Email must be a string')
		} else if (this.email.length < 3 || this.email.length > 50) {
			this.errors.push('Email must be between 3 and 50 characters')
		} else if (
			!emailConditions.some((condition) =>
				this.email.includes(condition)
			) &&
			this.email.length < 12
		) {
			this.errors.push('Invalid email')
		}

		if (this.errors.length > 0) return true
	}

	public validatePassword = async (): Promise<boolean | void> => {
		this.cleanErrors()

		if (!this.password) {
			this.errors.push('Password is required')
		} else if (typeof this.password !== 'string') {
			this.errors.push('Password must be a string')
		} else if (this.password.length < 6 || this.password.length > 16) {
			this.errors.push('Password must be between 6 and 16 characters')
		}

		if (this.errors.length > 0) return true
	}
}
