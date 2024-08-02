const connection = require('../connection');

const createTables = async (nombreInquilino) => {
  try {
    const compradorQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.purchaser (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(15),
        document VARCHAR(20) NOT NULL
      )
    `;

    const notificacionQuery = `
    CREATE TABLE IF NOT EXISTS ${nombreInquilino}.notification (
      id SERIAL PRIMARY KEY,
      description VARCHAR(200),
      type VARCHAR(100)  CHECK (type IN ('configuracion','suscripcion','sistema')),
      code INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    const configQuery = `
    CREATE TABLE IF NOT EXISTS ${nombreInquilino}.config (
      id SERIAL PRIMARY KEY,
      phone_verified BOOLEAN DEFAULT false,
      phone_status BOOLEAN DEFAULT false,
      email VARCHAR(100) NULL,
      password_email VARCHAR(100) NULL,
      email_status BOOLEAN DEFAULT false,
      email_verified BOOLEAN DEFAULT false,
      logo VARCHAR(255) NULL,
      bussines_name VARCHAR(255) NULL
    )
  `;

    const asignacionQuery = `
      CREATE TABLE IF NOT EXISTS ${nombreInquilino}.assignament (
        id SERIAL PRIMARY KEY,
        id_raffle INTEGER REFERENCES ${nombreInquilino}.raffle(id) ON DELETE CASCADE,
        number INTEGER,
        status VARCHAR(20) DEFAULT 'disponible' CHECK (status IN ('pagado', 'separado', 'ganador')),  -- Estado predeterminado: disponible
        id_purchaser INTEGER REFERENCES ${nombreInquilino}.purchaser(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

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

    const configInsertQuery = `
    INSERT INTO ${nombreInquilino}.config (phone_verified, phone_status, email, password_email, email_status, email_verified, logo, bussines_name)
    VALUES (false, false, NULL, NULL, false, false, NULL, NULL)
  `;

    const insert1 = `
    INSERT INTO ${nombreInquilino}.purchaser (name, email, phone, document) VALUES 
    ('luis corena', 'luis@example.com', '+57 3216396330', '334123456'),
    ('Juan Pérez', 'juan.perez@example.com', '+57 3177229993', '531123456');
  `;

    const insert2 = `
    INSERT INTO ${nombreInquilino}.raffle (tittle, price, country, image, numbers, type, prizes) VALUES 
    ('Mi Primera Rifa', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
    ('Mi Primera Rifa 2', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
    ('Mi Primera Rifa 3', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
    ('Mi Primera Rifa 4', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]'),
    ('Mi Primera Rifa 5', 100, 'Colombia', 'imagen.jpg', '1000', 'premio_unico', '[{"id":1,"descripcion": "Primer Premio","loteria":"SINUANO NOCHE","ganador":"", "fecha": "2024-12-31"}]');
  `;

    const insert3 = `
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
    await connection.execute(compradorQuery);
    await connection.execute(asignacionQuery);
    await connection.execute(notificacionQuery);
    await connection.execute(configQuery);
    await connection.execute(rifaQuery);
    await connection.execute(insert1);
    await connection.execute(insert2);
    await connection.execute(insert3);
    await connection.execute(configInsertQuery);

    // Verificar si el índice ya existe antes de crearlo
    const indexExistsQuery = `
      SELECT COUNT(*) AS count 
      FROM information_schema.statistics 
      WHERE table_schema = '${nombreInquilino}' 
      AND table_name = 'assignament' 
      AND index_name = 'idx_id_raffle';
    `;

    const [rows] = await connection.execute(indexExistsQuery);
    if (rows[0].count === 0) {
      const asignacionIndexQuery = `
        CREATE INDEX idx_id_raffle ON ${nombreInquilino}.assignament(id_raffle);
      `;
      await connection.execute(asignacionIndexQuery);
    }

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
    throw error;
  }
};

module.exports = createTables;
