import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true }
})

const UserModel = mongoose.model('User', UserSchema)

export class User {
	private static _email: string
	private static _password: string

	constructor(email: string, password: string) {
		this.email = email
		this.password = password
	}

	public get password(): string {
		return User._password
	}
	public set password(value: string) {
		User._password = value
	}

	public get email(): string {
		return User._email
	}
	public set email(value: string) {
		User._email = value
	}
}
