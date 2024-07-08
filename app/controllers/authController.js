const jwt = require('../models/jwt');
const bcrypt = require('bcrypt');
const User = require('../models/inquilino.js');
const Config = require('../models/inquilino/config.js');
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
        const status= await subs(email);
      
        const usuario2 = await User.find('email',email);
       // return res.json(usuario);
        if (!usuario2) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

      

        if (!usuario2.status) {
            return res.status(401).json({ error: 'Este Usuario está desactivado, contáctese con el proveedor' });
        }
        // Verificar si la contraseña es correcta
        const valid = await bcrypt.compare(password, usuario2.password);
        if (!valid) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        
        if(status===true||status===false){
            const payed = usuario2.payed==0?false:true;
            if(status!==payed){
               // console.log("necesita actualizar");
                update(usuario2,status);
        
            }
            if(status===payed){
                // console.log("no necesita actualizar");
            }

        }else{console.log("status no es booleano")};

        

        const usuario = await User.find('email',email);

        // Si las credenciales son correctas, generar un token JWT
        const payload = {  id: usuario.id,name: usuario.name,dominio: usuario.domain,phone:usuario.phone,email: usuario.email,pais: usuario.country,role: usuario.role,payed:usuario.payed };
        const token = jwt.generateToken(payload, '1h');
        console.log("access_token: "+token);

        const mainDomain = process.env.MAIN_DOMAIN;
        const domain = `${usuario.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
        res.json({mensaje:"Has logeado correctamente", access_token:token, user: { id: usuario.id,name:usuario.name, domain:usuario.domain, email: usuario.email, country:usuario.country, role: usuario.role,payed:usuario.payed},main_domain: domain });
   
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

    const { name, phone, email, password, role, domain, country } = req.body;
      
    try {
      await User.crearTabla();
    const aa = await User.find("email",email);
     if(!!aa) return res.json({error:"Email ya ha sido tomado"});
    const bb = await User.find("domain",domain);
     if(!!bb) return res.json({error:"Dominio ya ha sido tomado"}); 
     const created = await User.crear(name, domain, phone, email, country, password, role, true, false);
     await createDatabase(domain);
     await fixDatabase(domain);

     await subdomains();

     const finded = await User.find('id',created.insertId);

      const payload = {  id: finded.id,name: finded.name,dominio: finded.domain,phone:finded.phone,email: finded.email,pais: finded.country,role: finded.role,payed:finded.payed };
        const token = jwt.generateToken(payload, '1h');
        const mainDomain = process.env.MAIN_DOMAIN;
        const domain2 = `${finded.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
     return   res.json({ mensaje:"Registro completado exitosamente",access_token:token, user: payload,main_domain: domain2 });
    
     
    } catch (error) {
    
      res.status(500).send({error:error.message});
    }
  };


  const subs= async (email)=>{
    const url = 'https://api.mercadopago.com/preapproval/search';
  
    const token = process.env.MP_TOKEN;
    
     const queryString = email ? `?payer_email=${encodeURIComponent(email)}` : '';
 
     try {
         const response = await fetch(`${url}${queryString}`, {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': token,
             },
         });
      
 
         if (!response.ok) {
             console.log(`Error ${response.status}: ${response.statusText}`);
            throw "no se ha podido obtener el status";
            }
         const data = await response.json();

         if(!data.results[0]){
            return false;
         }else{
            if(data.results[0].status==="authorized"){
                return true;
            }else if(data.results[0].status==="paused"){
                return false;
            }else{
                return false;
            }
         }
         
     } catch (error) {
        throw "no se ha podido obtener el status";
     }
  }

const update = async(usuario,boolean)=>{
    try{
        const update = await User.update(usuario.id,{payed:boolean});
        if(boolean===false ){
            const update2 = await Config.update(usuario.domain,{phone_status:false,email_status:false})
        }

    }catch(e){
        throw "error al valorar la suscripcion";
    }
}