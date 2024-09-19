exports.onlyAdmin = (req, res, next) => {
    // Verificar si el usuario tiene el rol de administrador
    if (req.decodedToken.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Este recurso solo está disponible para administradores.' });
    }
    next();
};

exports.onlyUser = (req, res, next) => {
    
    
    // Verificar si el usuario tiene el rol de usuario
    if (req.decodedToken.role !== 'user') {
        return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta ruta como usuario' });
    }
    next();
};