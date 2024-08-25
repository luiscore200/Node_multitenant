const comprador = require("../../models/inquilino/comprador");
const {validateUpdateRifa} = require("../../validators/rifaValidator");
const Asignaciones = require('../../models/inquilino/asiganciones');







exports.store = async (req, res) => {
   
   // return res.json(req.body);


    //validaciones
    const {name,email,phone,document}=req.body;
    const{decodedToken}= req;
    
    //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}

    try{
        const find = await comprador.find(decodedToken? decodedToken.dominio:"numero1Dominio",'email',email);
        if(find!=null){return res.json({mensaje:"email en uso, comprador existe actualmente",comprador:find[0]})};
        
        const response=  await comprador.store(decodedToken? decodedToken.dominio:"numero1Dominio",name,email,phone,document);
        const find2 = await comprador.find(decodedToken? decodedToken.dominio:"numero1Dominio",'id',response.insertId);
        if(find2!=null){return res.json({mensaje:"comprador creado con exito",comprador:find2[0]})}
        else{return res.json({error:"se ha producido un error al crear el usuario"})}
       
    }catch(e){
        
        console.log(e.message);
    }
    
   
    

}


exports.index = async (req, res) => {
   
    // return res.json(req.body);
 
 
     //validaciones
   
     const{decodedToken}= req;
     
     //    if(!decodedToken){return res.json({error:"dominio no encontrado"});}
     
 
     try{
        
          
       const index = await comprador.index(decodedToken?decodedToken.dominio:"numero1Dominio");
      
      // console.log(index)
       return res.json({mensaje:"Peticion aceptada con exito",compradores:index});
        
     }catch(e){
         
         console.log(e.message);
     }
     
    
     
 
 }