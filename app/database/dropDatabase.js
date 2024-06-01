const connection = require('./connection');
require('dotenv').config();

const eliminarBaseDatos = (nombreInquilino) => {
  return new Promise((resolve, reject) => {
    // Ejecutar la consulta de eliminación de la base de datos del inquilino
    const query = `DROP DATABASE IF EXISTS ${nombreInquilino}`;
    connection.execute(query)
      .then(([results]) => {
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = eliminarBaseDatos;
