import express from 'express'
import {
	authenticationPage,
	loginUser,
	logoutUser,
	registerUser
} from './src/controllers/authenticationController'
import {
	contactPage,
	editIndexPage,
	registerContact
} from './src/controllers/contactController'
import { homePage } from './src/controllers/homeController'
import { loginRequired } from './src/middlewares/middleware'

const router = express.Router()

// Navigation routes
router.get('/', homePage)

// Authentication routes
router.get('/authentication/index', authenticationPage)
router.get('/authentication', authenticationPage)
router.get('/authentication/logout', logoutUser)
router.post('/authentication/register', registerUser)
router.post('/authentication/login', loginUser)

// Contact routes
router.get('/contacts/index', loginRequired, contactPage)
router.get('/contacts/index/:id', loginRequired, editIndexPage)
router.get('/contacts/:id', loginRequired, editIndexPage)
router.get('/contacts/', loginRequired, contactPage)
router.post('/contacts/register', loginRequired, registerContact)

export default router
