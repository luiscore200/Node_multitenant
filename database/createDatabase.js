const connection = require('./connection');

// Función para crear la base de datos del inquilino
const createDatabase = (nombreInquilino) => {
  return new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${nombreInquilino}`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = createDatabase;
