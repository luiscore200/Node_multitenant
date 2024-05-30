const connection = require('../connection');

const createProductosTable = (nombreInquilino) => {
  return new Promise((resolve, reject) => {
    // Guardar la base de datos original
    const originalDatabase = process.env.DB_NAME;

    // Cambiar la conexión a la base de datos del inquilino
    connection.changeUser({ database: nombreInquilino }, (err) => {
      if (err) {
        return reject(err);
      }

      connection.query(`
        CREATE TABLE IF NOT EXISTS productos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          precio DECIMAL(10, 2) NOT NULL
        )
      `, (err) => {
        if (err) {
          // Restaurar la conexión original en caso de error
          connection.changeUser({ database: originalDatabase }, () => {
            return reject(err);
          });
        } else {
          console.log('Tabla de productos creada exitosamente');

          // Restaurar la conexión original
          connection.changeUser({ database: originalDatabase }, (err) => {
            if (err) {
              return reject(err);
            } else {
              return resolve();
            }
          });
        }
      });
    });
  });
};

module.exports = createProductosTable;
