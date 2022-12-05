import express from 'express'
import {
	authenticationPage,
	loginUser,
	registerUser
} from './src/controllers/authenticationController'
import { homePage } from './src/controllers/homeController'

const router = express.Router()

// Rotas da home
router.get('/', homePage)

// Authentication routes
router.get('/authentication/index', authenticationPage)
router.get('/authentication', authenticationPage)
router.post('/authentication/register', registerUser)
router.post('/authentication/login', loginUser)

export default router
