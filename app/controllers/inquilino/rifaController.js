const Rifa = require("../../models/inquilino/rifa");
const {validateUpdateRifa,validateCreateRifa, assignNumbersValidator} = require("../../validators/rifaValidator");
const Asignaciones = require('../../models/inquilino/asiganciones');







exports.store = async (req, res) => {
   
    //validaciones
    const {rifa,premios}=req.body;
    const{decodedToken}= req;
    
    //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}

    const validationError = validateCreateRifa(update);
    if (validationError) {
        return res.status(400).json(validationError);
    }

  
    const premios2 = rifa.tipo=="anticipados"? premios.map(obj => ({ ...obj })).reverse(): premios;
    console.log(premios2);

    try{
        
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
          
            const premios = JSON.parse(item.prizes);
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

    try {
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
      if (existingNumber.length > 0) {
        alreadyAssignedNumbers.push(number);
      }
    }

   
    if (alreadyAssignedNumbers.length > 0) {
      return res.json({ error: `Los numeros ${alreadyAssignedNumbers.join(', ')} ya estan asignados` });
    }
    
      const asignaciones = await Promise.all(numbers.map(async (number) => {
        return await Asignaciones.store(decodedToken ? decodedToken.dominio : "numero1Dominio", id, number, "separado", id_comprador);
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
        const a= Asignaciones.findByRaffle(decodedToken ? decodedToken.dominio : "numero1Dominio",id);
        if(a.length===0){
            res.status(500).json({ error: 'Asignacion no encontrada' });
        }
           await Asignaciones.update(decodedToken ? decodedToken.dominio : "numero1Dominio",id,{status:"pagado"});

        

         return res.json({mensaje:"objeto actualizado con exito"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
      
  };

  exports.actualizarGanador = async (req,res)=>{
   
    const { id } = req.params;
    const update = req.body;
    const{decodedToken}= req;
   // return res.json(update);
    // if(!decodedToken){return res.json({error:"dominio no encontrado"});}


    try {

    const a= await Rifa.find(decodedToken ? decodedToken.dominio : "numero1Dominio","id",id)
    if(!a){return res.json({error:"rifa no encontrada"})}

    const premios2 = a.type === "anticipado" ? update.map(obj => ({ ...obj })).reverse() : update;

    const updates = {
        prizes:JSON.stringify(premios2),
    };
//return res.json(updates);
  
   
        const response = await Rifa.update(decodedToken? decodedToken.dominio:"numero1Dominio", id, updates);
        if (response.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Algo salio mal durante la acutalizacion" });
        }

        return res.json({mensaje:"Ganador asignado con exito"});
       
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ error: "Error al actualizar el ganador" });
    }



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


