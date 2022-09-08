const express = require('express');
const router = express.Router();
const homeController = require('./src/controllers/homeController');
const contactController = require('./src/controllers/contactController');

// Rotas da home
router.get('/', homeController.homePage);
router.post('/', homeController.verifyPost);

// Rotas de contato
router.get('/contact', contactController.homePage);


module.exports = router;
