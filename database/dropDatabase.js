const connection = require('./connection');
require('dotenv').config();

const eliminarBaseDatos = (nombreInquilino) => {
  return new Promise((resolve, reject) => {
    // Cambiar a la base de datos principal
    connection.changeUser({ database: process.env.DB_NAME },  (err) => {
      if (err) {
        return reject(err);
      }

      // Ejecutar la eliminación de la base de datos del inquilino
      connection.query(`DROP DATABASE IF EXISTS ${nombreInquilino}`, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });
};

module.exports = eliminarBaseDatos;
