import mongoose from 'mongoose'
import validator from 'validator'

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
	public static errors: any[] = new Array([])

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
		Authentication.errors.splice(0, Authentication.errors.length)
	}

	public validateEmail = async (): Promise<boolean> => {
		this.cleanErrors()

		if (!this.email) {
			Authentication.errors.push('Email is required')

			return false
		} else if (!validator.isEmail(this.email)) {
			Authentication.errors.push('Invalid email validator')

			return false
		}

		return true
	}

	public validatePassword = async (): Promise<boolean | void> => {
		this.cleanErrors()

		if (!this.password) {
			Authentication.errors.push('Password is required')

			return false
		} else if (this.password.length < 6 || this.password.length > 16) {
			Authentication.errors.push(
				'Password must be between 6 and 16 characters'
			)

			return false
		}

		return true
	}

	public register = async (): Promise<boolean | void> => {
		this.cleanErrors()

		try {
			if (!(await this.validateEmail())) {
				Authentication.errors.push('Invalid email')
			} else if (!(await this.validatePassword())) {
				Authentication.errors.push('Invalid password')
			} else {
				await AuthenticationModel.create({
					email: this.email,
					password: this.password
				})
					.then((): boolean => {
						console.log('User registered successfully')

						return true
					})
					.catch((error: any): boolean => {
						console.log('Error registering user')
						console.log(error)

						return false
					})

				return true
			}
		} catch (error) {
			console.log(error)

			throw new Error(error)
		}
	}

	public login = async (): Promise<boolean | void> => {
		this.cleanErrors()

		try {
			if (!(await this.validateEmail())) {
				Authentication.errors.push('Invalid email')
			} else if (!(await this.validatePassword())) {
				Authentication.errors.push('Invalid password')
			} else {
				await AuthenticationModel.findOne({
					email: this.email,
					password: this.password
				}).then((user: Object) => {
					if (!user) {
						Authentication.errors.push('Invalid email or password')
					} else {
						return true
					}
				})
				Authentication.errors.push('Invalid email or password')
			}
		} catch (error) {
			console.log(error)
			throw new Error(error)
		}
	}
}
