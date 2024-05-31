const connection = require('../connection');

const createProductosTable = async (nombreInquilino) => {
  try {
    // Query para crear la tabla de productos en la base de datos del inquilino
    const query = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL
      )
    `;

    // Ejecutar la consulta
    await connection.query(query);

    console.log('Tabla de productos creada exitosamente');
  } catch (error) {
    console.error('Error al crear la tabla de productos:', error);
    throw error;
  }
};

module.exports = createProductosTable;
