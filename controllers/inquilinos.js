const express = require('express');
const router = express.Router();
const Inquilino = require('../models/inquilino');
const createDatabase = require('../database/createDatabase');

const fixDatabase = require('../database/inquilino/fixDatabase');
const seedDatabase = require('../database/inquilino/seedDatabase');
const dropDatabase =  require('../database/dropDatabase');







// Ruta para crear un nuevo inquilino
router.post('/', async (req, res) => {
  const nombreInquilino = req.body.nombre;
  
  try {
    // Crear un nuevo inquilino en la base de datos principal
    await Inquilino.crear(nombreInquilino); 
    // Crear la base de datos del inquilino
    await createDatabase(nombreInquilino);
    // Agregar tablas a la base de datos
    await fixDatabase(nombreInquilino);
    // Insertar datos de prueba en la tabla de productos
    await seedDatabase(nombreInquilino);
    res.status(201).send('Inquilino creado exitosamente');
  } catch (error) {
    console.error('Error al crear el inquilino:', error);
    res.status(500).send('Error interno del servidor');
  }
});



// Ruta para eliminar un inquilino
router.delete('/:id', async (req, res) => {
  const idInquilino = req.params.id;
  
  try {
    // Eliminar el inquilino de la base de datos principal
     const inquilino = await Inquilino.find(idInquilino);
  //   console.log("inquilino encontrado es: ",inquilino);
     if(inquilino!=null){
    
        await dropDatabase(inquilino.nombre);
      }
      
    
  } catch (error) {
    console.error('Error al eliminar el inquilino:', error);
    res.status(500).send('Error interno del servidor');
  }
//  console.log(inquilino.nombre);
 

  try {
    // Eliminar el inquilino de la base de datos principal
//    await Inquilino.eliminar(idInquilino);
    res.send('Inquilino eliminado exitosamente');
    
  } catch (error) {
    console.error('Error al eliminar el inquilino:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
