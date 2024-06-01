const jwt = require('../models/jwt');
const bcrypt = require('bcrypt');
const Inquilino = require('../models/inquilino.js');
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
        const usuario = await Inquilino.findEmail(email);
       // return res.json(usuario);
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Verificar si la contraseña es correcta
        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // Si las credenciales son correctas, generar un token JWT
        const payload = { id: usuario.id, email: usuario.email };
        const token = jwt.generateToken(payload, '1h');
        console.log("token: "+token);

        const mainDomain = process.env.MAIN_DOMAIN;
        const dominio = `${usuario.nombre}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
        res.json({ token, usuario: { id: usuario.id, email: usuario.email, dominio } });
   
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ mensaje: 'Error en la autenticación' });
    }
};
