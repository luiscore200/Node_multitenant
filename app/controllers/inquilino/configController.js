const Email = require('../../notifications/mailerService');
const whatsapp = require('../../notifications/whatsappService3');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const Config = require("../../models/inquilino/config");
const Email2 = require('../../notifications/mailerService2');
const { validateConfigUpdate } = require('../../validators/configValidator');


exports.sendQr = async (req, res) => {
    const { decodedToken } = req;

    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}

    try {
       

        const dominio = decodedToken?decodedToken.dominio:"numero1Dominio"; // Si no hay dominio en el token, usa "numero1Dominio"

        // Elimina el QR anterior, si existe
        const qrPath = path.join(__dirname, `../../utils/qr_codes/${dominio}_qr.png`);
        if (fs.existsSync(qrPath)) {
            fs.unlinkSync(qrPath);
        }

        // Crea el QR como imagen PNG
        const qrString = await whatsapp.crearQr(dominio); // Suponiendo que crearQr devuelve el QR como string
        await qrcode.toFile(qrPath, qrString, { type: 'png' });

       

        // Envía el correo electrónico con el QR adjunto como imagen
        await Email.sendMailWithQR(decodedToken ? decodedToken.email : "luedco2009@gmail.com", 'QR Code', qrPath);


        res.json({ message: 'Correo electrónico con QR enviado correctamente.' });
    } catch (error) {
        console.error('Error al enviar el correo con QR:', error);
        res.status(500).json({ error: 'Error al enviar el correo con QR.' });
    }
};


exports.verifyConection= async(req,res)=>{

    const { decodedToken } = req;

    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
    try{
        await whatsapp.sendMessage(decodedToken?decodedToken.dominio:"numero1Dominio","333311232323","¡Hola este es un mensaje de prueba!")
      //  await whatsapp.addMessageToQueue(decodedToken?decodedToken.dominio:"numero1Dominio","333311232323","¡Hola este es un mensaje de prueba!")
      //  await whatsapp.sendAll();
            return res.json({mensaje:"confirmacion completada"});
    }catch(e){
        return res.json({error:"ha ocurrido un error al confirmar"});

    }

};

exports.exportConfig = async(req,res)=>{
    const { decodedToken } = req;

    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
    try{
      const conf=  await Config.index(decodedToken?decodedToken.dominio:"numero1Dominio")
      //  await whatsapp.addMessageToQueue(decodedToken?decodedToken.dominio:"numero1Dominio","333311232323","¡Hola este es un mensaje de prueba!")
      //  await whatsapp.sendAll();
      console.log(conf);
            return res.json({mensaje:"configuracion exportada con exito",config:conf});
    }catch(e){
        console.log(e);
        return res.json({error:"error al exportar la configuracion"});

    }

};


exports.verifyGmail = async(req,res)=>{
    const { decodedToken } = req;
    const{email,password}=req.body;

  //  return res.json(req.body);

    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
    try{
        await Email2.verifyEmail(decodedToken?decodedToken.dominio:"numero1Dominio",email,password);
        
              return res.json({mensaje:"Email verificado con exito"});
      }catch(e){
          return res.json({error:"No se pudo verificar el Email"});
  
      }

};


exports.saveConfig = async(req,res)=>{


    const { decodedToken } = req;
    const update = req.body

    //return res.json(req.body);

    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}

    const validationError = validateConfigUpdate(update);
    if (validationError) {
        return res.status(400).json(validationError);
    }


   try {
    const conf=  await Config.index(decodedToken?decodedToken.dominio:"numero1Dominio");

    
    const atributosCambiados = [];

    for (const clave in conf) {
        if (conf.hasOwnProperty(clave) && update.hasOwnProperty(clave)) {
            if (conf[clave] !== update[clave]) {
                atributosCambiados.push(clave);
            }
        }
    }



    if(atributosCambiados.find(obj => obj==="phone_status")){
        const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"phone_status":update.phone_status});
    }

    if(atributosCambiados.find(obj => obj==="phone_verified")){
        const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"phone_verified":update.phone_verified});
    }

    if(atributosCambiados.find(obj => obj==="email")){
        const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"email":update.email});
    }
    
   if(atributosCambiados.find(obj => obj==="password_email")){
       const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"password_email":update.password_email});
   }

   if(atributosCambiados.find(obj => obj==="email_status")){
    const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"email_status":update.email_status});
}
if(atributosCambiados.find(obj => obj==="email_verified")){
    const updated = await Config.update(decodedToken?decodedToken.dominio:"numero1Dominio",{"email_verified":update.email_verified});
}



   
   return res.json({mensaje:"configuracion actualizada con exito"});

   } catch (error) {
    console.log(error);
    return res.json({error:error.message});
   }


};


