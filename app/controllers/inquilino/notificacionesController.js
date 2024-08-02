const config = require("../../models/inquilino/notificaciones");


exports.index = async (req,res)=>{
   
    const { decodedToken } = req;
  
    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
    await config.deleteOld(decodedToken?decodedToken.dominio:"numero1Dominio");
    const index = await config.index(decodedToken?decodedToken.dominio:"numero1Dominio");
    return res.json({mensaje:"",notificaciones:index});

}