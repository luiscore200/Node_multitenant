const jwt = require('../models/jwt');
const bcrypt = require('bcrypt');
const User = require('../models/inquilino.js');
const {validateLogin} = require('../validators/authValidator.js');
require('dotenv').config();
const createDatabase = require('../database/createDatabase.js');
const fixDatabase = require('../database/inquilino/fixDatabase.js');
const subdomains = require('../utils/updateDomains.js');
const {validateCreateUser} = require('../validators/userValidator.js');

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
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        if (!usuario.status) {
            return res.status(401).json({ error: 'Este Usuario está desactivado, contáctese con el proveedor' });
        }
        // Verificar si la contraseña es correcta
        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Si las credenciales son correctas, generar un token JWT
        const payload = {  id: usuario.id,name: usuario.name,dominio: usuario.domain,phone:usuario.phone,email: usuario.email,pais: usuario.country,role: usuario.role, };
        const token = jwt.generateToken(payload, '1h');
        console.log("access_token: "+token);

        const mainDomain = process.env.MAIN_DOMAIN;
        const domain = `${usuario.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
        res.json({mensaje:"Has logeado correctamente", access_token:token, user: { id: usuario.id,name:usuario.name, domain:usuario.domain, email: usuario.email, country:usuario.country, role: usuario.role},main_domain: domain });
   
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ error: 'Error en la autenticación' });
    }
};


exports.register = async (req, res) => {
    
    const validationError = validateCreateUser(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError.mensaje }); // Enviar una respuesta con el mensaje de error de validación
    }

    const { name, phone, email, password, role, status,domain, country } = req.body;
      
    try {
      await User.crearTabla();
    const aa = await User.find("email",email);
     if(!!aa) return res.json({error:"Email ya ha sido tomado"});
    const bb = await User.find("domain",domain);
     if(!!bb) return res.json({error:"Dominio ya ha sido tomado"}); 
     const created = await User.crear(name, domain, phone, email, country, password, role, true);
     await createDatabase(domain);
     await fixDatabase(domain);

     await subdomains();

     const finded = await User.find('id',created.insertId);

      const payload = {  id: finded.id,name: finded.name,dominio: finded.domain,phone:finded.phone,email: finded.email,pais: finded.country,role: finded.role, };
        const token = jwt.generateToken(payload, '1h');
        const mainDomain = process.env.MAIN_DOMAIN;
        const domain2 = `${finded.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
     return   res.json({ mensaje:"Registro completado exitosamente",access_token:token, user: payload,main_domain: domain2 });
    
     
    } catch (error) {
    
      res.status(500).send({error:error.message});
    }
  };

