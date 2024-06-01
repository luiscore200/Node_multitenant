const JWT = require('../models/jwt');

exports.verifytoken = async (req, res, next) => {

    let token;
    const authHeader = req.headers['authorization'];

 // 1. Token en el encabezado Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

      // 3. Token en el cuerpo de la solicitud
      if (!token && req.body) {
        token = req.body.token;
    }

    // 4. Token como un parámetro de URL
    if (!token && req.query) {
        token = req.query.token;
    }

  
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decodedToken = JWT.verifyToken(token);
       // console.log('Decoded Token:', decodedToken);

        if (!decodedToken) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        console.error("Middleware token verification error:", error.message);
        return res.status(500).json({ error: 'Error al verificar el token' });
    }
};
