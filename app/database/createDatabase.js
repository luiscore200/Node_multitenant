const connection = require('./connection');

// Función para crear la base de datos del inquilino
const createDatabase = async (nombreInquilino) => {
  try {
    const [results] = await connection.execute(`CREATE DATABASE IF NOT EXISTS ${nombreInquilino}`);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = createDatabase;
