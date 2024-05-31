const fs = require('fs');
const path = require('path');
const Inquilino = require('../models/inquilino');

 const  actualizarSubdominios = async () => {

    try{

        const inquilinos = await Inquilino.index();
        
        const subdominios = inquilinos.map(inquilino => inquilino.nombre);

        // Generar la ruta del archivo en la carpeta 'data'
        const filePath = path.join(__dirname, '.' , 'subdominios.json');
    
        // Escribir los nombres en el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(subdominios, null, 2));

    } catch (error) {
        console.error('Error al obtener dominios:', error);
      
      }

   
}

module.exports = actualizarSubdominios;
