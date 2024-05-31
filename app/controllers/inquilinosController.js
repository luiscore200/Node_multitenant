const Inquilino = require('../models/inquilino.js');
const createDatabase = require('../database/createDatabase.js');
const fixDatabase = require('../database/inquilino/fixDatabase.js');
const seedDatabase = require('../database/inquilino/seedDatabase.js');
const dropDatabase = require('../database/dropDatabase.js');
const subdomains = require('../domains/updateDomains.js');

exports.createInquilino = async (req, res) => {
  const nombreInquilino = req.body.nombre;
  
  try {
    await Inquilino.crear(nombreInquilino);
    await createDatabase(nombreInquilino);
    await fixDatabase(nombreInquilino);
    await seedDatabase(nombreInquilino);
    await subdomains();

    res.status(201).send('Inquilino creado exitosamente');
  } catch (error) {
    console.error('Error al crear el inquilino:', error);
    res.status(500).send(""+error);
  }
};

exports.deleteInquilino = async (req, res) => {
  const idInquilino = req.params.id;
  
  try {
    const inquilino = await Inquilino.find(idInquilino);
    if (inquilino != null) {
      await dropDatabase(inquilino.nombre);
    }
    
    await Inquilino.eliminar(idInquilino);
    await subdomains();

    res.send('Inquilino eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar el inquilino:', error);
    res.status(500).send('Error interno del servidor');
  }
};
