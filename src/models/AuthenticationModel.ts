import bcrypt from 'bcryptjs'
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
	public static user: any

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

	public verifyIfUserExists = async (): Promise<boolean | Error> => {
		try {
			const userExists = await AuthenticationModel.findOne({
				email: this.email
			})

			if (userExists) {
				Authentication.errors.push('User already exists')

				return false
			}

			console.log([userExists, this.email])
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public checkValidations = async (): Promise<boolean | Error> => {
		try {
			if (!(await this.validateEmail())) {
				return false
			} else if (!(await this.validatePassword())) {
				return false
			} else if (!(await this.verifyIfUserExists())) {
				return false
			}

			return true
		} catch (error) {
			console.log(error)

			throw new Error(error)
		}
	}

	public registerUser = async (): Promise<boolean | Error> => {
		this.cleanErrors()

		try {
			if (!(await this.checkValidations())) {
				return false
			}

			const salt = bcrypt.genSaltSync(16)
			await AuthenticationModel.create({
				email: this.email,
				password: bcrypt.hashSync(this.password, salt)
			})
				.then((): boolean => {
					return true
				})
				.catch((error: any): boolean => {
					return false
				})

			return true
		} catch (error) {
			console.log(error)

			throw new Error(error)
		}
	}

	public loginUser = async (): Promise<boolean | Error> => {
		this.cleanErrors()

		try {
			if (!(await this.validateEmail())) {
				Authentication.errors.push('Invalid email')
			} else if (!(await this.validatePassword())) {
				Authentication.errors.push('Invalid password')
			} else {
				const user = await AuthenticationModel.findOne({
					email: this.email
				})

				if (user) {
					if (bcrypt.compareSync(this.password, user.password)) {
						Authentication.user = user

						return true
					} else {
						Authentication.errors.push('Invalid password')
					}
				}

				Authentication.errors.push('The request was not successful')

				return false
			}
		} catch (error) {
			throw new Error(error as string)
		}
	}
}
