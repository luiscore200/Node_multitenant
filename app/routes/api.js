const express = require('express');
const router = express.Router();
const { checkDomain } = require('../middleware/checkDomain');
const inquilinosController = require('../controllers/inquilinosController');
const productController = require('../controllers/inquilino/productoController');

// Ruta para crear un nuevo inquilino
router.post('/inquilino', inquilinosController.createInquilino);

// Ruta para eliminar un inquilino
router.delete('/inquilino/:id', inquilinosController.deleteInquilino);

//productos
router.get('/productos', checkDomain, productController.index);

module.exports = router;