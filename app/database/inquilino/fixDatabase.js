const connection = require('../connection');

const createTables = async (nombreInquilino) => {
  try {
 /*   // Query para crear la tabla de productos en la base de datos del inquilino
    const productosQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL
      )
    `;*/

    // Query para crear la tabla de compradores
    const compradorQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.purchaser (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) ,
        email VARCHAR(100) ,
        phone VARCHAR(15) ,
        document VARCHAR(20) NOT NULL
      )
    `;

    // Query para crear la tabla de asignaciones
    const asignacionQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.assignament (
        id SERIAL PRIMARY KEY,
        id_raffle INTEGER REFERENCES ${nombreInquilino}.raffle(id) ON DELETE CASCADE,
        number VARCHAR(10),
        status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('disponible', 'pagado', 'separado', 'ganador')),  -- Estado predeterminado: disponible
        id_purchaser INTEGER REFERENCES ${nombreInquilino}.purcharser(id) ON DELETE SET NULL
      )
    `;
    const asignacionIndexQuery = `
      CREATE INDEX IF NOT EXISTS idx_id_raffle ON ${nombreInquilino}.assignament(id_raffle);
    `;

    // Query para crear la tabla de rifas
    const rifaQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.raffle (
        id SERIAL PRIMARY KEY,
        tittle VARCHAR(100),
        price INTEGER,
        country VARCHAR (255),
        image VARCHAR(255) DEFAULT NULL,
        numbers VARCHAR(20), 
        type VARCHAR(20) CHECK (type IN ('premio_unico', 'oportunidades', 'anticipados')),
        prizes JSON
      )
    `;

    // Ejecutar las consultas
   // await connection.execute(productosQuery);
    await connection.execute(compradorQuery);
    await connection.execute(asignacionQuery);
    await connection.execute(asignacionIndexQuery);
    await connection.execute(rifaQuery);

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
    throw error;
  }
};

module.exports = createTables;
