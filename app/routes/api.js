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
const configController = require('../controllers/inquilino/configController');
const adminConfigController = require('../controllers/adminConfigController');
const autogestionController = require('../controllers/autogestionController');
const notificacionesController = require('../controllers/inquilino/notificacionesController');

router.get('/hola', async(req,res)=>{ return res.json("holaaaaaaaa"); });

//autogestion
router.get('/generate', autogestionController.generateToken);
router.get('/autogestion/:token',autogestionController.autogestion);
router.get('',autogestionController.redireccion);

//notificaiones-usuario
router.get('/user/notification/index',notificacionesController.index);




// Inquilinos
router.post('/user/store', userController.storeUser);
router.delete('/user/delete/:id', userController.deleteUser);
router.get('/user/index', userController.indexUser);
router.put('/user/update/:id', userController.updateUser);

//utils
router.get('/utils/phoneCode',utilsController.indexPhone);
router.get('/utils/subs',utilsController.indexSub);

//auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

//rifa
router.post('/rifa/store',rifaController.uploadImages,rifaController.store);
router.get('/rifa/index',rifaController.index);
router.delete('/rifa/delete/:id',rifaController.delete);
router.post('/rifa/update/:id',rifaController.uploadImages,rifaController.update);
router.get('/rifa/getNumeros/:id',rifaController.getNumeros);
router.post('/rifa/assignNumbers/:id',verifytoken,rifaController.assignNumbers);
router.get('/rifa/getSeparated/:id',rifaController.getSeparados);
router.get('/rifa/confirmSeparated/:id',rifaController.confirmarSeparados);
router.delete('/rifa/deleteSeparated/:id',rifaController.eliminarSeparados);
router.post('/rifa/confirmWinner/:id',rifaController.actualizarGanador);
router.get('/rifa/find/:id',rifaController.rifaFind);

//comprador 
router.post('/comprador/store',compradorController.store);
router.get('/comprador/index',compradorController.index);

//config -inquilinos
router.get('/user/config/sendQr', configController.sendQr);
router.get('/user/config/verifyQr', configController.verifyConection);
router.get('/user/config/export', configController.exportConfig);
router.post('/user/config/verifyEmail', configController.verifyGmail);
router.post('/user/config/saveConfig', configController.saveConfig);


//config admin
router.post('/admin/config/saveConfig',adminConfigController.uploadImages, adminConfigController.saveConfig);
router.get('/admin/config/loadConfig',adminConfigController.index);

router.get('/generalConfig',adminConfigController.generalConfig);

module.exports = router;