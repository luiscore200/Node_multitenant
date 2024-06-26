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
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(15) ,
        document VARCHAR(20) NOT NULL
      )
    `;

    // Query para crear la tabla de asignaciones
    const asignacionQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.assignament (
        id SERIAL PRIMARY KEY,
        id_raffle INTEGER REFERENCES ${nombreInquilino}.raffle(id) ON DELETE CASCADE,
        number INTEGER,
        status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('pagado', 'separado', 'ganador')),  -- Estado predeterminado: disponible
        id_purchaser INTEGER REFERENCES ${nombreInquilino}.purcharser(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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


    const insert1= `
INSERT INTO ${nombreInquilino}.purchaser (name, email, phone, document) VALUES 
('luis corena', 'luis@example.com', '12347890', '334123456'),
('Juan Pérez', 'juan.perez@example.com', '1234567890', '531123456');`;

const insert2= `
INSERT INTO ${nombreInquilino}.raffle (tittle, price, country, image, numbers, type, prizes) VALUES 
('Mi Primera Rifa', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
('Mi Primera Rifa 2', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
('Mi Primera Rifa 3', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
('Mi Primera Rifa 4', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
('Mi Primera Rifa 5', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]');


`;

const insert3= `
INSERT INTO ${nombreInquilino}.assignament (id_raffle, number, status, id_purchaser) VALUES 
(1, 31, 'pagado', 1),
(1, 33, 'separado', 1),
(1, 41, 'separado', 1),
(1, 42, 'separado', 1),
(1, 43, 'separado', 1),
(1, 46, 'separado', 1),
(1, 12, 'separado', 2),
(1, 11, 'separado', 2),
(1, 4, 'separado', 2),
(1, 6, 'separado', 2),
(1, 7, 'separado', 2);


`;


    // Ejecutar las consultas
   // await connection.execute(productosQuery);
    await connection.execute(compradorQuery);
    await connection.execute(asignacionQuery);
    await connection.execute(asignacionIndexQuery);
    await connection.execute(rifaQuery);
    await connection.execute(insert1);
    await connection.execute(insert2);
    await connection.execute(insert3);

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
    throw error;
  }
};

module.exports = createTables;
