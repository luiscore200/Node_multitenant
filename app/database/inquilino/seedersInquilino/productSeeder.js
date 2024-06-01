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

const productSeeder = async (nombreInquilino) => {
  try {
    const productos = generarProductosAleatorios(nombreInquilino);

    // Generar la consulta de inserción
    const values = productos.map(producto => `('${producto.nombre}', ${producto.precio})`).join(',');

    // Insertar los productos en la tabla 'productos'
    const query = `INSERT INTO ${nombreInquilino}.productos (nombre, precio) VALUES ${values}`;
    const [results] = await connection.execute(query);

    console.log("Productos semillas agregados con éxito");
    return results;
  } catch (error) {
    console.error("Error al agregar los productos semillas:", error);
    throw error;
  }
};

module.exports = productSeeder;
