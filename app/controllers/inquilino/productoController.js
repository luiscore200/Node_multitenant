const Producto = require('../../models/inquilino/producto');

exports.index = async (req, res) => {
  const tenantDb = req.clientAccount; // El subdominio ya fue verificado por el middleware

  try {
    const productos = await Producto.index(tenantDb);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
