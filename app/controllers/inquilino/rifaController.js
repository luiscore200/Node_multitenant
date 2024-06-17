const Rifa = require("../../models/inquilino/rifa");
const {validateUpdateRifa} = require("../../validators/rifaValidator")







exports.store = async (req, res) => {
   
    //validaciones
    const {rifa,premios}=req.body;
    const{decodedToken}= req;
    
    //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}
  
    const premios2 = rifa.tipo=="anticipados"? premios.map(obj => ({ ...obj })).reverse(): premios;
    console.log(premios2);

    try{
        
        const response=  await Rifa.store(decodedToken? decodedToken.dominio:"numero1Dominio",rifa.titulo, rifa.precio,rifa.pais,rifa.numeros,rifa.tipo,premios2);
        return res.json({mensaje:"rifa creada con exito"});
    }catch(e){
        console.log(e.message);
    }
    
   
    

}
exports.index = async (req,res)=>{
    const{decodedToken}= req;
//return res.json({error:"aswdasdsad"});
   
    
//    if(!decodedToken){return res.json({error:"dominio no encontrado"});}
    try{

        const index = await Rifa.index(decodedToken? decodedToken.dominio:"numero1Dominio");
        const array=[];
        index.forEach(item => 
             
              {
                const premios = JSON.parse(item.prizes);    
                const premios2 = item.type=="anticipados"? premios.map(obj => ({ ...obj })).reverse(): premios;
                const obj = {
                    id: item.id,
                    titulo: item.tittle,
                    precio: item.price,
                    pais: item.country,
                    numeros:item.numbers,
                    tipo:item.type,
                    imagen:item.image,
                    premios:premios2,
                    

                }
                array.push(obj);
              }
             
             
          )

    return res.json(array);
        
    }catch(e){
        console.log(e.message);
        return e.message;
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