
const fs = require('fs');
const path = require('path');
const  {makeWASocket,DisconnectReason,fetchLatestBaileysVersion, useMultiFileAuthState}= require('@whiskeysockets/baileys');
const dns = require('dns');
const config = require('../models/inquilino/config');
const notification = require('../models/inquilino/notificaciones');

const logger = {
    level: 'fatal',
    fatal: (msg, ...args) => console.error('FATAL:', msg, ...args),
    error: (msg, ...args) => console.error('ERROR:', msg, ...args),
  //  warn: (msg, ...args) => console.error('WARN:', msg, ...args),
  //  info: (msg, ...args) => console.error('INFO:', msg, ...args),
   // debug: (msg, ...args) => console.error('DEBUG:', msg, ...args),
   // trace: (msg, ...args) => console.error('TRACE:', msg, ...args),
    warn: () => {}, // Ignorar logs de nivel warn
    info: () => {}, // Ignorar logs de nivel info
    debug: () => {}, // Ignorar logs de nivel debug
    trace: () => {}, // Ignorar logs de nivel trace
   
    child: () => logger // Devuelve el mismo logger para manejar sub-loggers
};


let sessions = {};
let messageQueue = [];
let pendingMessages = [];
let sending = false;

  
const formatPhone=(number)=> {
    const Number = number.replace(/[^\d]/g, '');
        return Number; 
    }


const sendMessageWithTimeout = async (sock, jid, message, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject('Timeout al enviar el mensaje'), timeout);
        sock.sendMessage(jid, { text: message })
            .then(() => {
                clearTimeout(timer);
                resolve();
            })
            .catch((error) => {
                clearTimeout(timer);
                reject(error);
            });
    });
};


const verificarConexionInternet = async () => {
    return new Promise((resolve, reject) => {
        dns.lookup('google.com', (err) => {
            if (err && err.code === 'ENOTFOUND') {
                reject('No hay conexión a Internet');
            } else {
                resolve(true);
            }
        });
    });
};

const verificarSesionActiva = async (sessionId) => {
    return fs.existsSync(getSessionPath(sessionId));
};


const getSessionPath = (sessionId)=>{return path.join(__dirname, `./sessions3/${sessionId}`) }



const limpiarMensajesAntiguos = async() => {
    const unDia = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const ahora = Date.now();

    messageQueue = messageQueue.filter(m => (ahora - m.createdAt) < unDia);
    pendingMessages = pendingMessages.filter(m => (ahora - m.createdAt) < unDia);
};

const moverMensajesASesionPendiente = (sessionId) => {
    const mensajesPendientes = messageQueue.filter(m => m.sessionId === sessionId);
    pendingMessages.push(...mensajesPendientes.map(m => ({ ...m, createdAt: Date.now() })));
    messageQueue = messageQueue.filter(m => m.sessionId !== sessionId);
};





exports.sessionManager = async(sessionId,create=false)=>{

    let newSession= create;

    if (sessions[sessionId] && !newSession) {
        console.log("no genera nueva conexion /////////////////////////////////////////////////////////////////");
             return sessions[sessionId];
         }
         console.log("si genera nueva conexion /////////////////////////////////////////////////////////////////");
         const { state,saveCreds } = await useMultiFileAuthState(getSessionPath(sessionId));
         const { version } = await fetchLatestBaileysVersion();
         const sock =  makeWASocket({
             version,
             logger:logger,
             auth: state,
             printQRInTerminal: false,
             syncFullHistory: false,
             fireInitQueries: false,
             shouldSyncHistoryMessage: (msg) => {  return false;  },
             emitOwnEvents: false,
             maxMsgRetryCount:10000,
             keepAliveIntervalMs:20000,
             connectTimeoutMs:10000
            
         });
 
         return new Promise((resolve, reject) => {
         sock.ev.on('connection.update', async (update) => {
             const { connection,lastDisconnect } = update;
             if(update.qr!==undefined){
                if(!newSession){
                    sock.end();
                    reject("sesion cerrada");
                }else{
                 //   console.log(update.qr);
                    resolve(update.qr)
                }
             }else if (connection === 'open') {
                 
                 sessions[sessionId] = sock;
                 sock.ev.on('creds.update', saveCreds);
                   if(!newSession){
                      resolve(sock);
                   }else{
                        newSession=false;
                   }
              
                  }else if (connection === 'close') {

                    if(!newSession){
                        if(update.lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut){
                            exports.clearSession(sessionId);
                            reject("sesion cerrada");
                        }else {
                            reject('conexión cerrada');
                        }
                        
                    }else{
                        if (update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                            console.log("reintentando");
                            setTimeout(() => exports.sessionManager(sessionId,true), 5000);
                        }
                        if (update.lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
                            console.log("borrando y reintentando");
    
                            exports.clearSession(sessionId);
                            exports.sessionManager(sessionId,true);
                        }
                    }

                  
                    
             }
         });
     
     });

}









    exports.sendMessage=async(sessionId, number, message)=> {
        try {
            await verificarConexionInternet();
            if (!await verificarSesionActiva(sessionId)) {throw 'Sesión no existe'; }
    
            const sock = await exports.sessionManager(sessionId,false); 
            console.log("sock",sock);
            const numberClean = formatPhone(number);
            const jid = `${numberClean}@s.whatsapp.net`;

            await sendMessageWithTimeout(sock,jid,message);
        

        } catch (error) {
           // console.log("error",error);
            throw error;
        }

    }





 exports.addMessageToQueue = (sessionId, to, message) => {
    messageQueue.push({ sessionId, to, message, createdAt: Date.now()  });
};

exports.sendAll = async () => {
    if (sending) {
        return;
    }

    await limpiarMensajesAntiguos();
    sending = true;

    setImmediate(async () => {
        while (messageQueue.length > 0) {
            const { sessionId, to, message } = messageQueue[0];

            try {     

              await exports.sendMessage(sessionId, to, message);
                messageQueue.shift();

            } catch (error) {
                if (error === 'No hay conexión a Internet' || error === 'conexión cerrada') {
                    
                     console.log('No hay conexión a Internet, reintentando en 5 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else if (error === 'Sesión no existe' || error === 'sesión cerrada') {
                    
                    console.log('Problema de sesión, moviendo el mensaje a pendientes.');
                    moverMensajesASesionPendiente(sessionId);
                    closeService(sessionId);
                    notificar(sessionId);

                } else {
                    
                    console.log('Error desconocido, verificando conexión a Internet...');
                    try {
                        await verificarConexionInternet();
                        if (sessions[sessionId]) {
                            sessions[sessionId].end();
                            delete sessions[sessionId];
                            console.log('Reiniciando sesion, reintentando el envío en 10 segundos...');
                               await new Promise(resolve => setTimeout(resolve, 10000));
                            try {
                                await exports.sendMessage(sessionId, to, message);
                                messageQueue.shift();
                            } catch (retryError) {
                                console.error('todos los reintentos han fallado, moviendo a cola de espera');                             
                                moverMensajesASesionPendiente(sessionId);
                            }
                        } else {
                              moverMensajesASesionPendiente(sessionId);
                        }
                      
                    } catch (internetError) {
                        console.log('Error desconocido, reintentando en 5 segundos...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                       
                        await exports.sendMessage(sessionId, to, message);
                        
                    }
                }
            }
        }

        sending = false;
    });
};

    

    exports.clearSession = async(sessionId)=> {
        const sock = sessions[sessionId];
        if (sock) {
            sock.end();
            delete sessions[sessionId];
        }
        fs.rmSync(getSessionPath(sessionId), { recursive: true, force: true });
    }

  
    exports.sendPendings = async () => {
        await limpiarMensajesAntiguos();
        if (pendingMessages.length > 0) {
            messageQueue.push(...pendingMessages);
            pendingMessages = [];
            await exports.sendAll();
        }
    };
    
    exports.deletePendings = (sessionId) => {
        pendingMessages = pendingMessages.filter(m => m.sessionId !== sessionId);
    };
    

    exports.getContacts = async (sessionId) => {
        try {
        
       
        } catch (error) {
          console.error('Error:', error);
        }
      };

    
    const closeService = async(dominio)=>{
        try {
            
            const updated = await config.update(dominio,{"phone_status":false,"phone_verified":false});
            exports.clearSession(dominio);
        } catch (error) {
            console.log(error.message);
        }
    }

    const notificar = async(dominio)=>{
        await notification.deleteOld(dominio);
        await notification.deleteFrom(dominio,"code",300);
        await notification.deleteFrom(dominio,"code",301);
        await notification.store(dominio,{description:"Se ha desactivado el servicio de whatsapp por problemas de sesion",type:"configuracion",code:300});
        await notification.store(dominio,{description:"Se han encolado los mensajes, luego de un dia seran eliminados",type:"sistema",code:301});

    }