const connection = require('../connection');
const productSeeder = require('./seeders/productSeeder');

const seedDatabase = (nombreInquilino) => {
   
  return new Promise((resolve, reject) => {
    // Cambiar a la base de datos del inquilino
    connection.changeUser({ database: nombreInquilino }, async (err) => {
      if (err) {
        return reject(err);
      }

      try {
        // Ejecutar los seeders
        await productSeeder(nombreInquilino);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        // Cambiar de nuevo a la base de datos principal
        connection.changeUser({ database: process.env.DB_NAME }, (err) => {
          if (err) {
            console.error('Error al cambiar de nuevo a la base de datos principal:', err);
          }
        });
      }
    });
  });
};

module.exports = seedDatabase;