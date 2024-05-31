const connection = require('../database/connection');


connection.query(`
  CREATE TABLE IF NOT EXISTS inquilinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla inquilinos:', err);
  } else {
    console.log('Tabla inquilinos creada o ya existente');
  }
});


class Inquilino {
  constructor(nombre) {
    this.nombre = nombre;
  }

  static crear(nombre) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO inquilinos (nombre) VALUES (?)', [nombre], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static eliminar(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM inquilinos WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }


  static async find(id) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM inquilinos WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            reject(new Error('No se encontró ningún inquilino con ese ID'));
          } else {
            resolve(results[0]); // Retorna toda la información del inquilino
          }
        }
      });
    });
  }



static async index() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM inquilinos ', (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          reject(new Error('No se encontró ningún inquilino con ese ID'));
        } else {
          resolve(results); // Retorna toda la información del inquilino
        }
      }
    });
  });
}
}

module.exports = Inquilino;
