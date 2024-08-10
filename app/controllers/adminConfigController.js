const fs = require('fs').promises;

const path = require('path');
const multer = require('multer');
const Config = require('../models/config');
require('dotenv').config();
const Notificaciones = require('../models/notificaciones');
const Email = require("../notifications/mailerService");



//multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../src/images/admin/config")); // Cambia 'uploads' por la carpeta deseada
    },
    filename: function (req, file, cb) {
        console.log(file);
      cb(null, Date.now()+"_"+file.originalname); // Guarda el archivo con su nombre original
    }
  });
  const upload = multer({ storage: storage });
  //multer middleware
  exports.uploadImages = upload.fields([{ name: 'banner_1', maxCount: 1 },
    { name: 'banner_2', maxCount: 1 },{ name: 'banner_3', maxCount: 1 },{ name: 'app_logo', maxCount: 1 },{ name: 'app_icon', maxCount: 1 }]);


    const deleteImage = async (imagePath) => {
      try {
        // Verificar si el archivo existe
        await fs.access(imagePath);
    
        // Eliminar el archivo
        await fs.unlink(imagePath);
        console.log('File deleted successfully');
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File does not exist');
        } else {
          console.error('Error deleting file:', err);
        }
      }
    };
    

exports.saveConfig = async(req,res)=>{


    const { decodedToken } = req;
    const update = req.body;
    
    const images = {};
    
    //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
    //if(decodedToken.role!=="admin"){return res.status(400).json({error:"No autorizado"})}
    
    
  try {
    
    console.log(update);
    await Config.create();
    const conf=  await Config.index();

    
    const atributosCambiados = [];


       const updateKeys = Object.keys(update);

    // Iterar sobre las claves de update
    updateKeys.forEach(clave => {
      if (conf.hasOwnProperty(clave) && conf[clave] !== update[clave]) {
        atributosCambiados.push(clave);
      }
    });
//    console.log("atributos",atributosCambiados);

    if(atributosCambiados.find(obj => obj==="email")){
      const updated = await Config.update({"email":req.body.email});
  }
  if(atributosCambiados.find(obj => obj==="email_password")){
    const updated = await Config.update({"email_password":update.email_password});
}
if(atributosCambiados.find(obj => obj==="email")||atributosCambiados.find(obj => obj==="email_password")){
  EmailService();
}

if(atributosCambiados.find(obj => obj==="raffle_count")){
  const updated = await Config.update({"raffle_count":update.raffle_count});
}
if(atributosCambiados.find(obj => obj==="raffle_number")){
  const updated = await Config.update({"raffle_number":update.raffle_number});
}
if(atributosCambiados.find(obj => obj==="app_name")){
  const updated = await Config.update({"app_name":update.app_name});
}
if(atributosCambiados.find(obj => obj==="banner_1")){
  deleteImage(conf.banner_1);
  const updated = await Config.update({"banner_1":update.banner_1});
}
if(atributosCambiados.find(obj => obj==="banner_2")){
  deleteImage(conf.banner_2);
  const updated = await Config.update({"banner_2":update.banner_2});
}
if(atributosCambiados.find(obj => obj==="banner_3")){
  deleteImage(conf.banner_3);
  const updated = await Config.update({"banner_3":update.banner_3});
}
if(atributosCambiados.find(obj => obj==="app_logo")){
  deleteImage(conf.app_logo);
  const updated = await Config.update({"app_logo":update.app_logo});
}
if(atributosCambiados.find(obj => obj==="app_icon")){
  deleteImage(conf.app_icon);
  const updated = await Config.update({"app_icon":update.app_icon});
}

   
  
   

    if (req.files) {
      if (req.files.banner_1) {
        const banner1Path = req.files.banner_1[0].path;
        const relativeBanner1Path = path.relative(__dirname, banner1Path);
        images.banner_1 = relativeBanner1Path;
        await deleteImage(path.join(__dirname, conf.banner_1));
        await Config.update({ "banner_1": relativeBanner1Path });
      }
      if (req.files.banner_2) {
        const banner2Path = req.files.banner_2[0].path;
        const relativeBanner2Path = path.relative(__dirname, banner2Path);
        images.banner_2 = relativeBanner2Path;
        await deleteImage(path.join(__dirname, conf.banner_2));
        await Config.update({ "banner_2": relativeBanner2Path });
      }
      if (req.files.banner_3) {
        const banner3Path = req.files.banner_3[0].path;
        const relativeBanner3Path = path.relative(__dirname, banner3Path);
        images.banner_3 = relativeBanner3Path;
        await deleteImage(path.join(__dirname, conf.banner_3));
        await Config.update({ "banner_3": relativeBanner3Path });
      }
      if (req.files.app_logo) {
        const app_logoPath = req.files.app_logo[0].path;
        const relativeApp_logoPath = path.relative(__dirname, app_logoPath);
        images.app_logo = relativeApp_logoPath;
        await deleteImage(path.join(__dirname, conf.app_logo));
        await Config.update({ "app_logo": relativeApp_logoPath });
      }
      if (req.files.app_icon) {
        const app_iconPath = req.files.app_icon[0].path;
        const relativeApp_iconPath = path.relative(__dirname, app_iconPath);
        images.app_icon = relativeApp_iconPath;
        await deleteImage(path.join(__dirname, conf.app_icon));
        await Config.update({ "app_icon": relativeApp_iconPath });
      }
    }


    const aa= await Config.index();
    console.log(aa);
   // console.log('Banners:', images);
    
    return res.json({ mensaje: 'Configuración guardada correctamente.', images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al guardar la configuración.' });
  }
};



const baseUrl = process.env.MAIN_DOMAIN; // Reemplaza con tu URL base
//const baseUrl =`${process.env.HOST}/${process.env.PORT}` ; // Reemplaza con tu URL base
const processConfigForClient = (config, includePrivate = false) => {
  const processedConfig = {
    id: config.id,
    email: config.email,
    banner_1: config.banner_1 ? baseUrl + '/' + config.banner_1.replace('..\\', '').replace(/\\/g, '/') : '',
    banner_2: config.banner_2 ? baseUrl + '/' + config.banner_2.replace('..\\', '').replace(/\\/g, '/') : '',
    banner_3: config.banner_3 ? baseUrl + '/' + config.banner_3.replace('..\\', '').replace(/\\/g, '/') : '',
    app_logo: config.app_logo ? baseUrl + '/' + config.app_logo.replace('..\\', '').replace(/\\/g, '/') : '',
    app_icon: config.app_icon ? baseUrl + '/' + config.app_icon.replace('..\\', '').replace(/\\/g, '/') : '',
    app_name: config.app_name,
    raffle_count: config.raffle_count,
    raffle_number: config.raffle_number
  };

  if (includePrivate) {
    processedConfig.email_password = config.email_password;
  }

  return processedConfig;
};

exports.index = async (req, res) => {

  
  const { decodedToken } = req;

  
  //if (!decodedToken) {return res.status(400).json({ error: "Token decodificado no encontrado." })}
  //if(decodedToken.role!=="admin"){return res.status(400).json({error:"No autorizado"});'
  try {
    const config = await Config.index(); // Supongo que Config.index() devuelve el objeto de configuración
    
    const processedConfig = processConfigForClient(config,true);

    return res.json({mensaje:"Configuracion cargada con exito",config:processedConfig});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la configuración.' });
  }
};


exports.generalConfig = async (req, res) => {
  try {
    const config = await Config.index(); // Supongo que Config.index() devuelve el objeto de configuración
    
    const processedConfig = processConfigForClient(config,false);

    return res.json({mensaje:"Configuracion cargada con exito",config:processedConfig});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener la configuración.' });
  }
};


const EmailService = async()=>{
  await Email.Init();
  await Notificaciones.deleteOld();
  await Notificaciones.deleteFrom("code",302);
  await Notificaciones.deleteFrom("code",303);
}