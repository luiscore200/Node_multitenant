const Producto = require('../../models/inquilino/producto');

exports.index = async (req, res) => {

  const tenantDb = req.decodedToken && req.decodedToken.nombre ? req.decodedToken.nombre : req.clientAccount;
  if (!tenantDb) {
    return res.status(400).json({ error: 'No se pudo determinar el nombre del inquilino.' });
  }

 // El subdominio ya fue verificado por el middleware

  try {
    const productos = await Producto.index(tenantDb);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
