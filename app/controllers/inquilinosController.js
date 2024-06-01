  const Inquilino = require('../models/inquilino.js');
  const createDatabase = require('../database/createDatabase.js');
  const fixDatabase = require('../database/inquilino/fixDatabase.js');
  const seedDatabase = require('../database/inquilino/seedDatabaseInquilino.js');
  const dropDatabase = require('../database/dropDatabase.js');
  const subdomains = require('../domains/updateDomains.js');
  const {validateCreateUser} = require('../validators/userValidator.js');
  require('dotenv').config();




  exports.createInquilino = async (req, res) => {
    
    const validationError = validateCreateUser(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError.mensaje }); // Enviar una respuesta con el mensaje de error de validación
    }

    const { nombre, email, password, role } = req.body;
    
    try {
      await Inquilino.crearTabla();
     const created = await Inquilino.crear(nombre, email, password, role);
     await Inquilino.crearTabla();
     await createDatabase(nombre);
     await fixDatabase(nombre);
     await seedDatabase(nombre);
     await subdomains();
     const finded = await Inquilino.find(created.insertId);

     const main = process.env.MAIN_DOMAIN;

     const respuesta = {
      mensaje: 'Inquilino creado exitosamente',
      inquilino: {
        id: finded.id,
        nombre: finded.nombre,
        email: finded.email,
        role: finded.role,
        // Puedes incluir más campos del inquilino aquí si los deseas
      },
      dominio: `${nombre}.${main}`, // Reemplaza tudominio.com con tu dominio real
      };
      
    
    
      res.status(201).send(respuesta);
    } catch (error) {
      console.error('Error al crear el inquilino:', error);
      res.status(500).send('Error al crear el inquilino: ' + error.message);
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

      res.send('Inquilino eliminado exitosamente ');
    } catch (error) {
      console.error('Error al eliminar el inquilino:', error);
      res.status(500).send('Error interno del servidor');
    }
  };
