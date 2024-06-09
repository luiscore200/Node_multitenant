const express = require('express');
const router = express.Router();
const { checkDomain } = require('../middleware/checkDomain');
const { verifytoken } = require('../middleware/jwt');
const { onlyAdmin , onlyUser } = require('../middleware/role');
const userController = require('../controllers/inquilinoController');
const authController = require('../controllers/authController');
const utilsController = require('../controllers/utilsController');

// Inquilinos
router.post('/user/store', userController.storeUser);
router.delete('/user/delete/:id', userController.deleteUser);
router.get('/user/index', userController.indexUser);
router.put('/user/update/:id', userController.updateUser);



router.get('/utils/phoneCode',utilsController.indexPhone);
//auth
router.post('/auth', authController.login);

module.exports = router;