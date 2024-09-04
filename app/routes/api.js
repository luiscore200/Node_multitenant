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
router.get('/generate',[verifytoken], autogestionController.generateToken);
router.get('/autogestion/:token',autogestionController.autogestion);
router.get('',autogestionController.redireccion);

//notificaiones-usuario
router.get('/user/notification/index',[verifytoken],notificacionesController.index);




// Inquilinos
router.post('/user/store',[verifytoken], userController.storeUser);
router.delete('/user/delete/:id',[verifytoken], userController.deleteUser);
router.get('/user/index',[verifytoken], userController.indexUser);
router.put('/user/update/:id',[verifytoken], userController.updateUser);

//utils
router.get('/utils/phoneCode',utilsController.indexPhone);
router.get('/utils/subs',utilsController.indexSub);

//auth
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

//rifa
router.post('/rifa/store',[verifytoken,rifaController.uploadImages],rifaController.store);
router.get('/rifa/index',[verifytoken],rifaController.index);
router.delete('/rifa/delete/:id',[verifytoken],rifaController.delete);
router.post('/rifa/update/:id',[verifytoken,rifaController.uploadImages],rifaController.update);
router.get('/rifa/getNumeros/:id',[verifytoken],rifaController.getNumeros);
router.get('/rifa/notificarPendientes/:id',[verifytoken],rifaController.notificarPendientes);
router.get('/rifa/indexNumeros',[verifytoken],rifaController.indexNumeros);
router.post('/rifa/assignNumbers/:id',[verifytoken],rifaController.assignNumbers);
router.get('/rifa/getSeparated/:id',[verifytoken],rifaController.getSeparados);
router.get('/rifa/getAllAssignament/:id',[verifytoken],rifaController.getAllAssign);
router.get('/rifa/confirmSeparated/:id',[verifytoken],rifaController.confirmarSeparados);
router.delete('/rifa/deleteAssignament/:id',[verifytoken],rifaController.eliminarAsignacion);
router.post('/rifa/confirmWinner/:id',[verifytoken],rifaController.actualizarGanador);
router.get('/rifa/find/:id',[verifytoken],rifaController.rifaFind);
router.post('/rifa/forcedUpdateAssign',[verifytoken],rifaController.forcedUpdateAssign);

//comprador 
router.post('/comprador/store',[verifytoken],compradorController.store);
router.get('/comprador/index',[verifytoken],compradorController.index);

//config -inquilinos
router.get('/user/config/sendQr',[verifytoken], configController.sendQr);
router.get('/user/config/verifyQr',[verifytoken], configController.verifyConection);
router.get('/user/config/export',[verifytoken], configController.exportConfig);
router.post('/user/config/verifyEmail',[verifytoken], configController.verifyGmail);
router.post('/user/config/saveConfig',[verifytoken], configController.saveConfig);


//config admin
router.post('/admin/config/saveConfig',[verifytoken],adminConfigController.uploadImages, adminConfigController.saveConfig);
router.get('/admin/config/loadConfig',[verifytoken],adminConfigController.index);

router.get('/generalConfig',adminConfigController.generalConfig);

module.exports = router;