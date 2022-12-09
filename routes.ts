import express from 'express'
import {
	authenticationPage,
	loginUser,
	logoutUser,
	registerUser
} from './src/controllers/authenticationController'
import { contactPage } from './src/controllers/contactController'
import { homePage } from './src/controllers/homeController'

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
router.get('/contact/index', contactPage)
router.get('/contact/', contactPage)

export default router
