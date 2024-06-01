const connection = require('../../database/connection');

// Función para validar el nombre de la base de datos del inquilino
const validarNombreInquilino = (nombre) => {
  const regex = /^[a-zA-Z0-9_]+$/;
  return regex.test(nombre);
};

const Producto = {
  index: (tenantDb) => {
    return new Promise((resolve, reject) => {
      if (!validarNombreInquilino(tenantDb)) {
        return reject(new Error('Nombre de inquilino inválido'));
      }

      const query = `SELECT * FROM \`${tenantDb}\`.productos`;
      connection.execute(query)
        .then(([results]) => {
          resolve(results);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

module.exports = Producto;
