const connection = require('../../connection');

const generarProductosAleatorios = (nombreInquilino) => {
  const productos = [];
  for (let i = 1; i <= 10; i++) {
    const nombre = `Producto ${i}.${nombreInquilino}`;
    const precio = Math.floor(Math.random() * 100) + 1; // Precio aleatorio entre 1 y 100
    productos.push({ nombre, precio });
  }
  return productos;
};

const productSeeder = (nombreInquilino) => {
  return new Promise((resolve, reject) => {
    const productos = generarProductosAleatorios(nombreInquilino);

    // Generar la consulta de inserción
    const values = productos.map(producto => `('${producto.nombre}', ${producto.precio})`).join(',');

    // Insertar los productos en la tabla 'productos'
    connection.query(`INSERT INTO productos (nombre, precio) VALUES ${values}`, (err, results) => {
      if (err) {
        return reject(err);
      } else {

        console.log("productos semillas agregados con exito");
        resolve(results);
      }
    });
  });
};

module.exports = productSeeder;