import flash from 'connect-flash'
import MongoStore from 'connect-mongo'
import csrf from 'csurf'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import routes from './routes'
import {
	checkCsrfError,
	csrfMiddleware,
	middlewareGlobal
} from './src/middlewares/middleware'

const app = express()
const CONNECTIONSTRING =
	'mongodb+srv://AthirsonSilva:root@nestjs-crud-api.d8ehbpn.mongodb.net/agenda'

mongoose
	.connect(CONNECTIONSTRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		app.emit('pronto')
	})
	.catch((e) => console.log(e))

app.use(helmet())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
	secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
	store: MongoStore.create({ mongoUrl: CONNECTIONSTRING }),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true
	}
})
app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())
// Nossos próprios middlewares
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('pronto', () => {
	app.listen(3000, () => {
		console.log('Acessar http://localhost:3000')
		console.log('Servidor executando na porta 3000')
	})
})
