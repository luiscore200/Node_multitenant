const jwt = require('../models/jwt');
const bcrypt = require('bcrypt');
const User = require('../models/inquilino.js');
const Config = require('../models/inquilino/config.js');
const Notificaciones = require("../models/inquilino/notificaciones.js")
const adminNotificaciones = require("../models/notificaciones.js")
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

        if(usuario2.role ==="user"){

            const status= await subs(email);
             
        if(status){
            console.log("status",status);
            const payed = usuario2.payed==0?false:true;
            if(status.payed!==payed || usuario2.id_subscription!==status.id){
              //  console.log("necesita actualizar");
                update(usuario2,status);
        
            }
            if(status===payed){
                // console.log("no necesita actualizar");
                if(payed===true){
                    await Notificaciones.deleteFrom(dominio,"code",310);
                }else{
                    notificar(usuario2.domain);
                }
            }

        }else{console.log("status no es booleano")};
            
        }
      
      

       

        

        const usuario = await User.find('email',email);

        // Si las credenciales son correctas, generar un token JWTus
        const payload = {  id: usuario.id,name: usuario.name,dominio: usuario.domain,phone:usuario.phone,email: usuario.email,pais: usuario.country,role: usuario.role,payed:usuario.payed,id_subscription:usuario.id_suscription };
        const token = jwt.generateToken(payload, '24h');
        console.log("access_token: "+token);

        const mainDomain = process.env.MAIN_DOMAIN;
        const domain = `${usuario.domain}.${mainDomain}`;

        // Enviar el token JWT y la información del usuario como respuesta
        res.json({mensaje:"Has logeado correctamente", access_token:token, user: { id: usuario.id,name:usuario.name, domain:usuario.domain, email: usuario.email, country:usuario.country, role: usuario.role,payed:usuario.payed,id_subscription:usuario.id_subscription },main_domain: domain });
   
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ error: 'Error en la autenticación' });
    }
};


exports.register = async (req, res) => {
    console.log(req.body);
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
     const created = await User.crear(name, domain, phone, email, country, password, role, true, false,"");
     await createDatabase(domain);
     await fixDatabase(domain);

     await subdomains();

     const finded = await User.find('id',created.insertId);

      const payload = {  id: finded.id,name: finded.name,dominio: finded.domain,phone:finded.phone,email: finded.email,pais: finded.country,role: finded.role,payed:finded.payed,id_subscription:finded.id_subscription  };
        const token = jwt.generateToken(payload, '24h');
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
            await adminNotificaciones.deleteOld();
            await adminNotificaciones.insert({description:"un usuario ha intentado verificar su suscripcion y el api de mercado pago ha fallado",type:"sistema",code:9999})
            return false;
            }
         const data = await response.json();
       //  console.log(data.results[0]);
         const subscriptionId = data.results[0]["subscription_id"] ? data.results[0]["subscription_id"] : "";
       // console.log(subscriptionId);
         if(!data.results[0]){
            return {payed:false,id:""};
         }else{
            if(data.results[0].status==="authorized"){
                return {payed:true,id:subscriptionId};
            }else if(data.results[0].status==="paused"){
                return {payed:false,id:subscriptionId};
            }else if(data.results[0].status==="cancelled"){
                return {payed:false,id:subscriptionId};
            }else{
                return  {payed:false,id:""};
            }
         }
         
     } catch (error) {
        await adminNotificaciones.insert();
        await adminNotificaciones.deleteOld();
        await adminNotificaciones.store({description:"un usuario ha intentado verificar su suscripcion y el api de mercado pago ha fallado",type:"sistema",code:9999});
        console.error("Error en authController, subs:", error);
        return {payed:false,id:""};
     }
  }

const update = async(usuario,suscripcion)=>{
    try{
        console.log(suscripcion);
      
        const update = await User.update(usuario.id,{payed:suscripcion.payed,id_subscription:suscripcion.id});
    
        if(suscripcion.status===false ){
            const update2 = await Config.update(usuario.domain,{phone_status:false,email_status:false});
            notificar(dominio);
        }else{
            await Notificaciones.deleteFrom(dominio,"code",310);
        }

    }catch(e){
     //   throw "error al valorar la suscripcion";
     await adminNotificaciones.insert();
     await adminNotificaciones.deleteOld();
     await adminNotificaciones.store({description:"el sistema ha intentado usar la funcion update en authController, pero este ha fallado, si el mensaje se vuelve recurrente contactar al soporte",type:"sistema",code:9998})
     console.error("Error en authController, update:", e);
    }
}


const notificar = async(dominio)=>{
   
    await Notificaciones.deleteOld(dominio);
    await Notificaciones.deleteFrom(dominio,"code",310);
    await Notificaciones.store(dominio,{description:"No se encuentra suscrito, presione aqui para saber mas mas informacion sobre las ventajas de nuestros productos",type:"suscripcion",code:310});
   

}
