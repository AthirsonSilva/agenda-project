import express from 'express'
import { contactPage } from './src/controllers/contactController'
import { homePage, verifyPost } from './src/controllers/homeController'

const router = express.Router()

// Rotas da home
router.get('/', homePage)
router.post('/', verifyPost)

// Rotas de contato
router.get('/contact', contactPage)

export default router
