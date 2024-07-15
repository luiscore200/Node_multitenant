const Rifa = require("../../models/inquilino/rifa");
const {validateUpdateRifa,validateCreateRifa, assignNumbersValidator} = require("../../validators/rifaValidator");
const Asignaciones = require('../../models/inquilino/asiganciones');
const sendMail = require('../../notifications/mailerService');
const sendMail2 = require('../../notifications/mailerService2');
const {rifaGanador,rifaGanadorDeudor,rifaNoGanador,rifaConfirmacionNumero} = require('../../notifications/plantillas/rifaMails');
const rifaPlantillasWp = require('../../notifications/plantillas/rifaWp');
const whatsappService3 = require('../../notifications/whatsappService3');
const Config = require('../../models/inquilino/config');
const AdminConfig = require('../../models/config');
const Inquilino = require('../../models/inquilino');






exports.store = async (req, res) => {
   
    //validaciones
    const update = req.body;
    const {rifa,premios}=req.body;
    const{decodedToken}= req;
    
    //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}

    const validationError = validateCreateRifa(req.body);
    if (validationError) {
        return res.status(400).json(validationError);
    }

  
    const premios2 = rifa.tipo=="anticipados"? premios.map(obj => ({ ...obj })).reverse(): premios;
    console.log(premios2);

    try{

      const user= await Inquilino.find("id",decodedToken? decodedToken.id:34);
      const config= await AdminConfig.index();
      const count = await Rifa.index(decodedToken? decodedToken.dominio:"numero1Dominio");
      if(user.payed===0){
        if(Number(update.numeros)>Number(config.raffle_number)){  return res.json({error:`el numero maximo de numeros para un no suscrito es ${config.raffle_number}`,code:1}) }
        if(Number(config.raffle_count)<count.length){ return res.json({error:`el numero maximo de rifas para un no suscrito es ${config.raffle_count}`,code:2}) }
      }

        
        const response=  await Rifa.store(decodedToken? decodedToken.dominio:"numero1Dominio",rifa.titulo, rifa.precio,rifa.pais,rifa.numeros,rifa.tipo,premios2);
        return res.json({mensaje:"rifa creada con exito"});
    }catch(e){
        console.log(e.message);
    }
    
   
    

}
exports.index = async (req, res) => {
    const { decodedToken } = req;
    try {
        const rifas = await Rifa.index(decodedToken ? decodedToken.dominio : "numero1Dominio");
        
        // Utiliza map para crear un array de promesas
        const response = await Promise.all(rifas.map(async (item) => {

            const totalAsignaciones = await Asignaciones.countByRaffle(decodedToken ? decodedToken.dominio : "numero1Dominio", item.id);
          
            const premios = item.prizes;
            const premios2 = item.type == "anticipados" ? premios.map(obj => ({ ...obj })).reverse() : premios;
            return {
                id: item.id,
                titulo: item.tittle,
                precio: item.price,
                pais: item.country,
                numeros: item.numbers,
                tipo: item.type,
                imagen: item.image,
                premios: premios2,
                asignaciones: totalAsignaciones,
            };
        }));

        // Envía la respuesta con todos los resultados
        return res.json(response);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: e.message });
    }
}


exports.delete  = async(req,res)=>{
    const id= req.params.id;
    const{decodedToken}= req;
 
    //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}
   try{
    const aa= await Rifa.find(decodedToken? decodedToken.dominio:"numero1Dominio","id",id);
    if(!aa){  return res.json({error:"objeto no encontrado"});}
    const dd = Rifa.eliminar("numero1Dominio",id);
    return res.json({mensaje:"Rifa eliminada con exito"});
   }catch(error)
   {
    console.log(error);
    return res.json({error:error});
   }
}



exports.update = async (req, res) => {

//    return res.json(req.body);

    const fieldMapping = {
        id:'id',
        titulo: 'tittle',
        precio: 'price',
        pais: 'country',
        numeros: 'numbers',
        tipo: 'type',
        premios: 'prizes'
    };
    

    const validateFields = ['titulo','id', 'precio', 'tipo', 'pais', 'numeros', 'premios'];
    const { id } = req.params;
    const update = req.body;
    const{decodedToken}= req;
    
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}

    // Validar los campos recibidos
    const invalidFields = Object.keys(update).filter(key => !validateFields.includes(key));
    if (invalidFields.length > 0) {
        return res.status(400).json({ error: `Campos inválidos: ${invalidFields.join(', ')}` });
    }

    // Validar los datos de la rifa
    const validationError = validateUpdateRifa(update);
    if (validationError) {
        return res.status(400).json(validationError);
    }
    try {
        const user= await Inquilino.find("id",decodedToken? decodedToken.id:23);
        const config= await AdminConfig.index();
       // const count = await Rifa.index(decodedToken? decodedToken.dominio:"numero1Dominio");
        if(user.payed===0){
          if(Number(update.numeros)>Number(config.raffle_number)){  return res.json({error:`el numero maximo de numeros para un no suscrito es ${config.raffle_number}`,code:1}) }
       //   if(Number(config.raffle_count)<count.length){ return res.json({error:`el numero maximo de rifas para un no suscrito es ${config.raffle_count}`}) }
        }

        

    // Invertir el array de premios si el tipo es "anticipado"
    const premios2 = update.tipo === "anticipado" ? update.premios.map(obj => ({ ...obj })).reverse() : update.premios;

    // Crear objeto de actualizaciones con los nombres de campos en inglés
    const updates = {};
    for (const key in update) {
        if (update.hasOwnProperty(key)) {
            const mappedKey = fieldMapping[key];
            updates[mappedKey] = update[key];
        }
    }

//return res.json(updates);
    // Manejar el campo premios por separado
    if (premios2) {
        updates.prizes = JSON.stringify(premios2);
    }

   



        const response = await Rifa.update(decodedToken? decodedToken.dominio:"numero1Dominio", id, updates);
        if (response.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró la rifa para actualizar" });
        }
        return res.json({ mensaje: "Rifa actualizada con éxito" });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ mensaje: "Error al actualizar la rifa" });
    }
};

exports.getNumeros = async (req, res) => {


    const{decodedToken}= req;
    
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}
      

    try {
      const { id } = req.params;

      await Asignaciones.eliminarAntiguasSeparadas(decodedToken? decodedToken.dominio:"numero1Dominio");
      
      const asignaciones = await Asignaciones.findByRaffle(decodedToken? decodedToken.dominio:"numero1Dominio",id);
  
      // Extraer los números ocupados
      
  
      res.json(asignaciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los números ocupados' });
    }
  };


  
  exports.assignNumbers = async (req, res) => {

   // return res.json(req.body);
    const{decodedToken}= req;
    const{numbers,id_comprador,method}=req.body;
    const { id } = req.params;

    
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}
    
    const validationError = assignNumbersValidator(req.body);
    if (validationError) {
        return res.status(400).json(validationError);
    }

    try {
        
    const alreadyAssignedNumbers = [];

    
    for (const number of numbers) {
      const existingNumber = await Asignaciones.findNumberByRaffle(decodedToken ? decodedToken.dominio : "numero1Dominio", id, number);
      if (existingNumber) {
        alreadyAssignedNumbers.push(number);
      }
    }

   
    if (alreadyAssignedNumbers.length > 0) {
      return res.json({ error: `Los numeros ${alreadyAssignedNumbers.join(', ')} ya estan asignados` });
    }
    
      const asignaciones = await Promise.all(numbers.map(async (number) => {
        const asignacion =  await Asignaciones.store(decodedToken ? decodedToken.dominio : "numero1Dominio", id, number, "separado", id_comprador);
        return asignacion;
      }));
  
      res.json({ mensaje: "Asignaciones agregadas con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message});
    }
  };
  

    
  exports.getSeparados = async (req, res) => {
    const{decodedToken}= req;
    const { id } = req.params;
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}
    
    try {
        await Asignaciones.eliminarAntiguasSeparadas(decodedToken ? decodedToken.dominio : "numero1Dominio");

        const asignaciones = await Asignaciones.findSeparatedWithPurchasers(decodedToken ? decodedToken.dominio : "numero1Dominio", id);

      return  res.json(asignaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los números separados' });
    }
      
  };


      
  exports.eliminarSeparados = async (req, res) => {
    const{decodedToken}= req;
    const { id } = req.params;
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}
    
    try {

        const a= Asignaciones.findByRaffle(decodedToken ? decodedToken.dominio : "numero1Dominio",id);
        if(a.length===0){
            res.status(500).json({ error: 'Asignacion no encontrada' });
        }

        await Asignaciones.eliminar(decodedToken ? decodedToken.dominio : "numero1Dominio",id);

        

       return res.json({mensaje:"objeto eliminado con exito"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la asignacion' });
    }
      
  };

       
  exports.confirmarSeparados = async (req, res) => {
    const{decodedToken}= req;
    const { id } = req.params;
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}
  
    try {
      const conf= await Config.index(decodedToken ? decodedToken.dominio : "numero1Dominio");
     
     // return res.json(conf);
        const a= await Asignaciones.findById(decodedToken ? decodedToken.dominio : "numero1Dominio",id);
        console.log(a);
        if(!a){
          return  res.status(500).json({ error: 'Asignacion no encontrada' });
        }
           await Asignaciones.update(decodedToken ? decodedToken.dominio : "numero1Dominio",id,{status:"pagado"});
           const rifa = await Rifa.find(decodedToken ? decodedToken.dominio : "numero1Dominio","id",a.id_raffle);
            console.log(rifa);

      if(conf){
            if(conf.email_status===1 && conf.email_verified===1){
              sendMail2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",a.purchaser_email,`Confirmacion de compra `,rifaConfirmacionNumero(a,rifa.prizes));
              sendMail2.sendAll();
             
            }
            if(conf.email_status===0 || conf.email_verified===0){
              sendMail.addMessageToQueue(a.purchaser_email,`Confirmacion de compra `,rifaConfirmacionNumero(a,rifa.prizes));
              sendMail.sendAll();
             
            }
            
            if(conf.phone_status===1 && conf.phone_verified===1){
           
              whatsappService3.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",a.purchaser_phone,rifaPlantillasWp.rifaConfirmacionNumeroWhatsApp(a,rifa.prizes));
              whatsappService3.sendAll();
              
            }

      }else{
        sendMail.addMessageToQueue(a.purchaser_email,`Confirmacion de compra `,rifaConfirmacionNumero(a,rifa.prizes));
        sendMail.sendAll();
       
      }
     

         return res.json({mensaje:"objeto actualizado con exito"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
      
  };

  exports.actualizarGanador = async (req, res) => {
    const { id } = req.params;
    const update = req.body.premios;
    const index = req.body.index;
    const { decodedToken } = req;

    try {
      const conf= await Config.index(decodedToken ? decodedToken.dominio : "numero1Dominio");
        // Buscar la rifa por ID
        const a = await Rifa.find(decodedToken ? decodedToken.dominio : "numero1Dominio", "id", id);
        if (!a) {
            return res.json({ error: "Rifa no encontrada" });
        }

        // Preparar los premios para la actualización
        const premios2 = a.type === "anticipado" ? update.map(obj => ({ ...obj })).reverse() : update;
        const updates = {
            prizes: JSON.stringify(premios2),
        };

        // Actualizar la rifa con los nuevos premios
        const response = await Rifa.update(decodedToken ? decodedToken.dominio : "numero1Dominio", id, updates);
        if (response.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Algo salió mal durante la actualización" });
        }

        // Buscar el ganador del número de la rifa
        const ganador = await Asignaciones.findNumberByRaffle(decodedToken ? decodedToken.dominio : "numero1Dominio", id, update[index].ganador);

        // Agrupar las asignaciones por correo electrónico del comprador
        const all = await Asignaciones.findAllWithPurchasers(decodedToken ? decodedToken.dominio : "numero1Dominio", id);
        const agrupados = agruparPorUsuario(all);

     

       const GanadorNumber= Number(update[index].ganador) ;
        for (const email in agrupados) {
            const elementos = agrupados[email];
            console.log(elementos);
         
            const pagado = elementos.filter(element => element.status === 'pagado' && element.number===GanadorNumber);
            
            console.log(pagado)

            if (ganador && email === ganador.purchaser_email && pagado.length>0) {
             
              if(conf){
                if(conf.email_status===1 && conf.email_verified===1){
                  sendMail2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",ganador.purchaser_email,"¡Has ganado!",rifaGanador(ganador,update,index));
                  sendMail2.sendAll();
                }
                if(conf.email_status===0 || conf.email_verified===0){
                  sendMail.addMessageToQueue(ganador.purchaser_email,"¡Has ganado!",rifaGanador(ganador,update,index));
                  sendMail.sendAll();
                }
                
                if(conf.phone_status===1 && conf.phone_verified===1){
                  whatsappService3.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",ganador.purchaser_phone,rifaPlantillasWp.rifaGanadorWhatsApp(ganador,update,index))
                  whatsappService3.sendAll();
                }
          
                }else{
                  sendMail.addMessageToQueue(ganador.purchaser_email,"¡Has ganado!",rifaGanador(ganador,update,index));
                  sendMail.sendAll();
          
                }
           


            } else if (ganador && email === ganador.purchaser_email  && pagado.length===0) {

              if(conf){
                if(conf.email_status===1 && conf.email_verified===1){
                  sendMail2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",ganador.purchaser_email,"¡Has ganado!",rifaGanadorDeudor(ganador,update,index));
                  sendMail2.sendAll();
                }
                if(conf.email_status===0 || conf.email_verified===0){
                  sendMail.addMessageToQueue(ganador.purchaser_email,"¡Has ganado!",rifaGanadorDeudor(ganador,update,index));
                  sendMail.sendAll();
                }
                
                if(conf.phone_status===1 && conf.phone_verified===1){
                  whatsappService3.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",ganador.purchaser_phone,rifaPlantillasWp.rifaGanadorDeudorWhatsApp(ganador,update,index))
                  whatsappService3.sendAll();
                }
          
                }else{
                  sendMail.addMessageToQueue(ganador.purchaser_email,"¡Has ganado!",rifaGanadorDeudor(ganador,update,index));
                  sendMail.sendAll();
          
                }
       
            
            } else {

              const obj = elementos[0];

              if(conf){
                if(conf.email_status===1 && conf.email_verified===1){
                  sendMail2.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",email,"¡Has ganado!",rifaNoGanador(obj,update,index));
                  sendMail2.sendAll();
                }
                if(conf.email_status===0 || conf.email_verified===0){
                  sendMail.addMessageToQueue(email,"¡Has ganado!",rifaNoGanador(obj,update,index));
                  sendMail.sendAll();
                }
                
                if(conf.phone_status===1 && conf.phone_verified===1){
                  whatsappService3.addMessageToQueue(decodedToken ? decodedToken.dominio : "numero1Dominio",obj.purchaser_phone,
                    rifaPlantillasWp.rifaNoGanadorWhatsApp(obj,update,index))
                  whatsappService3.sendAll();
                }
          
                }else{
                  sendMail.addMessageToQueue(email,"Tu notificacion de juego",rifaNoGanador(obj,update,index));
                  sendMail.sendAll();
          
                }
       
              
             

            }
        }

        return res.json({ mensaje: "Ganador asignado con éxito" });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: "Error al actualizar el ganador" });
    }
};

// Función para agrupar asignaciones por correo electrónico del comprador
const agruparPorUsuario = (items) => {
    return items.reduce((acc, item) => {
        if (!acc[item.purchaser_email]) {
            acc[item.purchaser_email] = [];
        }
        acc[item.purchaser_email].push(item);
        return acc;
    }, {});
};

  exports.rifaFind = async (req,res)=>{
    const { id } = req.params;
    const{decodedToken}= req;
    
    try{
        const a= await Rifa.find(decodedToken ? decodedToken.dominio : "numero1Dominio","id",id)
        if(!a){return res.json({error:"rifa no encontrada"})}
    
    
        const premios = JSON.parse(a.prizes);
        const premios2 = a.type == "anticipados" ? premios.map(obj => ({ ...obj })).reverse() : premios;
        const rifa= {
            id: a.id,
            titulo: a.tittle,
            precio: a.price,
            pais: a.country,
            numeros: a.numbers,
            tipo: a.type,
            imagen: a.image,
            premios: premios2,
           
        };
        return res.json(rifa);
    }catch(e){
        return res.json({error:"Error al actualizar el item"});
    }
  };


