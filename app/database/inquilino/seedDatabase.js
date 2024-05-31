const connection = require('../connection');
const productSeeder = require('./seeders/productSeeder');

const seedDatabase = async (nombreInquilino) => {
try {
  await productSeeder(nombreInquilino);
  console.log('Seed realizado exitosamente.');
  
} catch (error) {
  console.error('Error en el proceso de seed:', error);
  throw error;
} 
};

module.exports = seedDatabase;