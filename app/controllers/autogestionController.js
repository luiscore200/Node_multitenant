const path = require('path');
const fs = require('fs');
require('dotenv').config();
const JWT = require('../models/jwt');
const script2 = require('../src/public/script');
const Asignaciones = require('../models/inquilino/asiganciones');
const Rifa = require('../models/inquilino/rifa');
const validator = require("../validators/autogestionValidator");
const Config = require('../models/inquilino/config');
const Purchaser = require("../models/inquilino/comprador");
const sendMail = require("../notifications/mailerService");
const sendMail2 = require("../notifications/mailerService2");
const whatsappService3= require("../notifications/whatsappService3");
const whatsappService2= require("../notifications/whatsappService2");
const plantillasEmail = require('../notifications/plantillas/rifaMails');
const plantillasWP = require("../notifications/plantillas/rifaWp");
const acortador = require("../utils/urlAcortador");



exports.generateToken = async(req, res) => {

    const{decodedToken}= req;
    
  //  http://localhost:3000/generate?id=1&user=3 ejemplo de query con user de la base de datos

    const {id} =req.query; //user,tokens
    const url = `${process.env.HOST}:${process.env.PORT}`;    
    const urls=[];
    const validationResult = validator.validateUserAndTokens(req.query);
    if (validationResult.mensaje) {return res.json({ error: validationResult.mensaje });}
   
    const { users, tokens } = validationResult;
    const conf= await Config.index(decodedToken ? decodedToken.dominio : "numero1Dominio");
    const currentRifa =await Rifa.find(decodedToken?decodedToken.dominio:"numero1Dominio","id",id);
    currentRifa.prizes = JSON.parse(currentRifa.prizes);
   // console.log(validationResult);
   //console.log(currentRifa);
   console.log(conf);

    if(!users && tokens){
    
       for (let index = 0; index < Number(tokens); index++) {
        const payload = {
            dominio:decodedToken?decodedToken.dominio:"numero1Dominio",
            raffle:id, 
            ref:index
        };
        const token = JWT.generateToken(payload, '24h');

       
        urls.push(`http://${url}/${token}`);

       }    
     //  console.log(urls);

       return res.json({urls});


    }
    if(users){

      const compradores = await Purchaser.index(decodedToken?decodedToken.dominio:"numero1Dominio");
      //console.log(compradores);
        
        for (let index = 0; index < users.length; index++) {
            const payload = {
                dominio:decodedToken?decodedToken.dominio:"numero1Dominio",
                raffle:id, 
                user:users[index]
            };
            const token = JWT.generateToken(payload, '24h');
            
            const obj = `http://${url}/autogestion/${token}`;
            urls.push(obj);
            
            const comprador = compradores.find(element => element.id === users[index]);

            if (comprador) {
                if(conf){
                  if(conf.email_status===1 && conf.email_verified===1){
                    sendMail2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",comprador.email,`Invitacion de juego `,plantillasEmail.rifaInvitacion(comprador,currentRifa,obj));                    
                  }
                  if(conf.email_status===0 || conf.email_verified===0){
                    sendMail.addMessageToQueue(comprador.email,`Invitacion de juego `,plantillasEmail.rifaInvitacion(comprador,currentRifa,obj));          
                  }
                  if( conf){                

                    const tokenAcortado = await acortador.insertToken(obj);
                    const urlAcortado = `http://${url}?st=${tokenAcortado}`;
                    whatsappService2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",comprador.phone,plantillasWP.invitacionRifaWhatsApp(comprador,currentRifa,urlAcortado));               
                  }
              }else{
              sendMail.addMessageToQueue(comprador.email,`Invitacion de juego `,plantillasEmail.rifaInvitacion(comprador,currentRifa,obj));            
              } 

            }
           }    
     
                  if(conf){
                    if(conf.email_status===1 && conf.email_verified===1){
                      sendMail2.sendAll();
                    }
                    if(conf.email_status===0 || conf.email_verified===0){
                      sendMail.sendAll();
                    }
                    if( conf.phone_verified ===1 && conf.phone_status ===1){
                      console.log("aaa");
                      whatsappService2.sendAll();
                    }
              }else{
                sendMail.sendAll();
              } 
     
              return res.json({mensaje:"se han enviado la invitaciones"})
    }   

};



const tratarToken =(token)=>{

    try {
        const decodedToken = JWT.verifyToken(token);
       // console.log('Decoded Token:', decodedToken);

        if (!decodedToken) {
            throw 'Token inválido o expirado'; 
        }
      //  return res.json(decodedToken);
        return  decodedToken;
        
    } catch (error) {
       
         throw 'Error al verificar el token'; 
    }

}



exports.redireccion =async (req, res) => {

  
  const {st} =req.query; //user,tokens
  await  acortador.cleanOldUrls();
  const url = await acortador.findUrl(st);
  console.log(st);
  console.log(url);
  if(url){
    res.redirect(url.url);

  }else{
    return res.json({error:"tal parece que el url, no existe o ha espirado, solicite otro a su provedor"});
  }

}














exports.autogestion =async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    console.log(token);


    try {


        const payload =  tratarToken(token);
        console.log(payload);
        const { raffle,dominio,user } = payload;


      
      await Asignaciones.eliminarAntiguasSeparadas(dominio? dominio:"numero1Dominio");
      
      const asignaciones = await Asignaciones.findByRaffle(dominio? dominio:"numero1Dominio",raffle);
 //     console.log(asignaciones);

      const rifa = await Rifa.find(dominio? dominio:"numero1Dominio","id",raffle);

      if(rifa===undefined){return res.json("rifa no existe, contactese con el provedor")};

      if(!Array.isArray(asignaciones)){return res.json("no se pudo recopilar los datos, contactese con el provedor")};

     
         
  
        const  totalNumbers= 10000;
        const price= 1000;
        const totalNums = parseInt(totalNumbers, 10);

        if (isNaN(totalNums)) {
            return res.status(400).send('"totalNumbers" deben ser números.');
        }

        // Lee el archivo HTML
        let html = fs.readFileSync(path.join(__dirname, '../src/public', 'index.html'), 'utf8');
        const script =script2.generateDynamicScript(token,  rifa,    asignaciones,    user?user:null);

        // Inserta el script dinámico
      
        html = html.replace('<!-- SCRIPT_PLACEHOLDER -->', script);

        res.send(html);

                
    } catch (error) {
       return res.json(error);
    }
 
};