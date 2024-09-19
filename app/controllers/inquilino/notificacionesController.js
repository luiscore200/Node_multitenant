const config = require("../../models/inquilino/notificaciones");
const adminConfig = require("../../models/notificaciones");


exports.index = async (req,res)=>{
   
    const { decodedToken } = req;
  try {
    
    if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
if(decodedToken && decodedToken.role==="admin"){
  await adminConfig.deleteOld();
  const index = await adminConfig.index();
  return res.json({mensaje:"",notificaciones:index});
}else{
 
  await config.deleteOld(decodedToken?decodedToken.dominio:"numero1Dominio");
  const index = await config.index(decodedToken?decodedToken.dominio:"numero1Dominio");
  return res.json({mensaje:"",notificaciones:index});
}

  } catch (error) {
    return res.json({error:"",notificaciones:[]});
  }
  
}