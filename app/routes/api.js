const express = require('express');
const router = express.Router();
const { checkDomain } = require('../middleware/checkDomain');
const { verifytoken } = require('../middleware/jwt');
const { onlyAdmin , onlyUser } = require('../middleware/role');
const userController = require('../controllers/inquilinoController');
const authController = require('../controllers/authController');
const utilsController = require('../controllers/utilsController');
const rifaController = require('../controllers/inquilino/rifaController');
const compradorController = require('../controllers/inquilino/compradorController');

// Inquilinos
router.post('/user/store', userController.storeUser);
router.delete('/user/delete/:id', userController.deleteUser);
router.get('/user/index', userController.indexUser);
router.put('/user/update/:id', userController.updateUser);



router.get('/utils/phoneCode',utilsController.indexPhone);
router.get('/utils/subs',utilsController.indexSub);
//auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

//rifa
router.post('/rifa/store',rifaController.store);
router.get('/rifa/index',rifaController.index);
router.delete('/rifa/delete/:id',rifaController.delete);
router.put('/rifa/update/:id',rifaController.update);
router.get('/rifa/getNumeros/:id',rifaController.getNumeros);
router.post('/rifa/assignNumbers/:id',rifaController.assignNumbers);
router.get('/rifa/getSeparated/:id',rifaController.getSeparados);
router.get('/rifa/confirmSeparated/:id',rifaController.confirmarSeparados);
router.delete('/rifa/deleteSeparated/:id',rifaController.eliminarSeparados);
router.post('/rifa/confirmWinner/:id',rifaController.actualizarGanador);
router.get('/rifa/find/:id',rifaController.rifaFind);


//comprador 
router.post('/comprador/store',compradorController.store);


module.exports = router;