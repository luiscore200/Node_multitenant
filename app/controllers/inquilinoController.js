  const User = require('../models/inquilino.js');
  const createDatabase = require('../database/createDatabase.js');
  const fixDatabase = require('../database/inquilino/fixDatabase.js');
  
  const dropDatabase = require('../database/dropDatabase.js');
  const subdomains = require('../utils/updateDomains.js');
  const {validateCreateUser,validateUpdateUser} = require('../validators/userValidator.js');
  require('dotenv').config();

  const validFields = ['name','domain', 'phone', 'email', 'country','password', 'status', 'role', 'payed','subscription_id'];
  
  exports.indexUser = async (req, res) => {

   // El subdominio ya fue verificado por el middleware
   
    try {
      const usuarios = await User.index();
      const array=[];
      usuarios.forEach(obj=>{
       const usuario = { 
        id:obj.id,
        name:obj.name,
        domain:obj.domain,
        phone:obj.phone,
        email:obj.email,
        country:obj.country,
        status: obj.status==1 ? 'Active':'Inactive',
        role:obj.role,
        payed:obj.payed===1? true:false,
       }
       if(obj.role=="user"){  
        array.push(usuario);
       }
    
    });

    return res.json(array);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.storeUser = async (req, res) => {
   // console.log(req.body);
    const validationError = validateCreateUser(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError.mensaje }); // Enviar una respuesta con el mensaje de error de validación
    }
    
    const { name, phone, email, password, role, status,domain, country,payed,id_subscription } = req.body;
      
    try {
      await User.crearTabla();
    const aa = await User.find("email",email);
     if(!!aa) return res.json({error:"Email ya ha sido tomado"});
    const bb = await User.find("domain",domain);
     if(!!bb) return res.json({error:"Dominio ya ha sido tomado"}); 
     const created = await User.crear(name, domain, phone, email, country, password, role, status, payed, id_subscription? id_subscription:"");
     await createDatabase(domain);
     await fixDatabase(domain);

    // await subdomains();
     const finded = await User.find('id',created.insertId);

     const main = process.env.MAIN_DOMAIN;

     const respuesta = {
      mensaje: 'Usuario creado exitosamente',
      inquilino: {
        id: finded.id,
        name: finded.name,
        dominio: finded.domain,
        phone:finded.phone,
        email: finded.email,
        pais: finded.country,
        role: finded.role,
        payed: finded.payed,
        id_subscription:finded.id_subscription?finded.id_subscription:"" 
        // Puedes incluir más campos del inquilino aquí si los deseas
      },
//      dominio: `${nombre}.${main}`, // Reemplaza tudominio.com con tu dominio real
      };
      
    
    
      res.status(201).send(respuesta);
    } catch (error) {
      console.error('Error al crear el Usuario:', error.message);
      res.status(500).send({error:error.message});
    }
  };




  exports.deleteUser = async (req, res) => {
    const idUser= req.params.id;

    try {
      const user = await User.find('id',idUser);
      if (user != null) {
        console.log(user.domain);
//        return res.json({mensaje:inquilino.name});
      await dropDatabase(user.domain);
    
      }else{
       return res.json({error:"Usuario no encontrado"});
      }
      
    await User.eliminar(idUser);
    await subdomains();

    return  res.send({mensaje:"El Usuario ha sido eliminado correctamente"});
    } catch (error) {
      console.error('Error al eliminar el usuario: ', error);
      res.status(500).send({error:error.message});
    }
  };



exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const updates = req.body; 

 console.log(updates);

  const invalidFields = Object.keys(updates).filter(key => !validFields.includes(key));
  if (invalidFields.length > 0) {
    return res.status(400).json({ error: `Campos inválidos: ${invalidFields.join(', ')}` });
  }

  

  const validationError = validateUpdateUser(updates);
  if (validationError) {
    return res.status(400).json({ error: validationError.mensaje });
  }
  
  try {
    const user = await User.find('id',id);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    const updated = await User.update(id, updates);

   // return res.json(updated);
    const updatesUser = await User.find('id',id);
      await subdomains();
    res.send({
      mensaje: 'Usuario actualizado exitosamente'
     // ,inquilino: updatedInquilino
    });
  } catch (error) {
    console.error('Error al actualizar el usuario: ', error);
    res.status(500).send('Error interno del servidor');
  }
};

