const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST =  '0.0.0.0';



// Habilitar CORS para todas las solicitudes
app.use(cors());


// Middleware para procesar solicitudes JSON
app.use(express.json());


// Servir archivos estáticos (por ejemplo, imágenes)
app.use('/src/images/admin/config', express.static(path.join(__dirname, '../src/images/admin/config')));
app.use('/src/images/user', express.static(path.join(__dirname, '../src/images/user')));


// Importar las rutas para los inquilinos
const routes = require('../routes/api');
app.use('/', routes);

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});