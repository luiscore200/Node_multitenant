const jwt = require('../models/jwt');
const bcrypt = require('bcrypt');
const User = require('../models/inquilino.js');
const {validateLogin} = require('../validators/authValidator.js');
require('dotenv').config();

exports.login = async (req, res) => {
   

    const validationError = validateLogin(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError.mensaje }); // Enviar una respuesta con el mensaje de error de validación
    }

    const {email,password} = req.body;
   // return res.json(req.body);
    try {
        const usuario = await User.find('email',email);
       // return res.json(usuario);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }
        if (!usuario.status) {
            return res.status(401).json({ mensaje: 'Este Usuario está desactivado, contáctese con el proveedor' });
        }
        // Verificar si la contraseña es correcta
        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Si las credenciales son correctas, generar un token JWT
        const payload = { id: usuario.id, email: usuario.email, role: usuario.role };
        const token = jwt.generateToken(payload, '1h');
        console.log("access_token: "+token);

        const mainDomain = process.env.MAIN_DOMAIN;
        const domain = `${usuario.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
        res.json({ access_token:token, user: { id: usuario.id,name:usuario.name, domain:usuario.domain, email: usuario.email, country:usuario.country, role: usuario.role},main_domain: domain });
   
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ mensaje: 'Error en la autenticación' });
    }
};
