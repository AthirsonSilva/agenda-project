import express from 'express'
import { homePage } from './src/controllers/homeController'
import { authenticationPage } from './src/controllers/loginController'

const router = express.Router()

// Rotas da home
router.get('/', homePage)

// Login routes
router.get('/authentication/index', authenticationPage)

export default router
