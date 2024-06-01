const express = require('express');
const router = express.Router();
const { checkDomain } = require('../middleware/checkDomain');
const { verifytoken } = require('../middleware/jwt');
const { onlyAdmin , onlyUser } = require('../middleware/role');
const inquilinosController = require('../controllers/inquilinosController');
const productController = require('../controllers/inquilino/productoController');
const authController = require('../controllers/authController');

// Inquilinos
router.post('/inquilino', inquilinosController.createInquilino);
router.delete('/inquilino/:id', inquilinosController.deleteInquilino);

//productos

router.get('/productos', [checkDomain], productController.index);

//auth
router.post('/auth', authController.login);

module.exports = router;