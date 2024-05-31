const express = require('express');
require('dotenv').config();
const app = express();


const PORT = process.env.PORT 





// Middleware para procesar solicitudes JSON
app.use(express.json());


// Importar las rutas para los inquilinos
const routes = require('../routes/api');
app.use('/', routes);

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
