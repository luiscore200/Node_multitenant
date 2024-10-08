const fs = require('fs').promises;
const path = require('path');
const Inquilino = require('../models/inquilino');

const actualizarSubdominios = async () => {
  try {
    const inquilinos = await Inquilino.index();
    const subdominios = inquilinos.map(inquilino => inquilino.domain);

    // Generar la ruta del archivo en la carpeta 'data'
    const filePath = path.join(__dirname, 'subdominios.json');

    // Escribir los nombres en el archivo JSON
    await fs.writeFile(filePath, JSON.stringify(subdominios, null, 2));
    
    console.log('Subdominios actualizados exitosamente');
  } catch (error) {
    console.error('Error al obtener dominios:', error);
    throw error;
  }
};

module.exports = actualizarSubdominios;
