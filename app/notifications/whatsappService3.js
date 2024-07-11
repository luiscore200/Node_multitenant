const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

let clients = {};
let sock;
let messageQueue = [];
let pendingMessages = [];
let sending = false;

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
    return fs.existsSync(path.join(__dirname, `./sessions/auth_info_${sessionId}`));
};

const limpiarMensajesAntiguos = () => {
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

exports.crearQr = async (sessionId) => {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, `./sessions/auth_info_${sessionId}`));

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    return new Promise((resolve, reject) => {
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                console.log(qr);
                resolve(qr); // Devolver el QR cuando se genera
            } else if (connection === 'close') {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 401;
                const shouldCreateQr = lastDisconnect.error?.output?.statusCode === 401;
                console.log('Connection closed, reconnecting:', shouldReconnect);
                if (shouldCreateQr) {
                    fs.rmSync(path.join(__dirname, `./sessions/auth_info_${sessionId}`), { recursive: true, force: true });
                    exports.crearQr(sessionId).then(resolve).catch(reject);
                }
                if (shouldReconnect) {
                    setTimeout(() => exports.crearQr(sessionId).then(resolve).catch(reject), 5000);
                }
            } else if (connection === 'open') {
                console.log('Connected');
                clients[sessionId] = sock;
            }
        });

        sock.ev.on('creds.update', saveCreds);
    });
};


exports.sendMessage = async (sessionId, to, message) => {
    try {
        await verificarConexionInternet();

        if (!await verificarSesionActiva(sessionId)) {
            throw 'Sesión no existe';
 }

        const { state } = await useMultiFileAuthState(path.join(__dirname, `./sessions/auth_info_${sessionId}`));

        sock = clients[sessionId] || makeWASocket({
            auth: state,
           // printQRInTerminal: true
        });

        const Number = to.replace(/[^\d]/g, '');


        return new Promise((resolve, reject) => {
            sock.ev.on('connection.update', async (update) => {
                const { connection,lastDisconnect } = update;
                if (connection === 'open') {
                    const jid = `${Number}@s.whatsapp.net`;
                    try {
                        await sendMessageWithTimeout(sock, jid, message);
                        console.log(`Mensaje enviado a ${to}`);
                        resolve();
                    } catch (error) {
                        console.log('Error al enviar el mensaje:', error);
                        reject(error);
                    }
                }else     if (connection === 'close') {
                  //  console.log(lastDisconnect.error);
                        if(lastDisconnect.error?.output?.statusCode===401){
                          
                            reject("sesion cerrada");
                        } else {
                            reject('conexión cerrada');
                        }
                       
                }
            });
        });

    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
};

exports.addMessageToQueue = (sessionId, to, message) => {
    messageQueue.push({ sessionId, to, message, createdAt: Date.now()  });
};

exports.sendAll = async () => {
    if (sending) {
        return;
    }

    limpiarMensajesAntiguos();

    sending = true;

    setImmediate(async () => {
        while (messageQueue.length > 0) {
            const { sessionId, to, message } = messageQueue[0];

            try {
                await exports.sendMessage(sessionId, to, message);
                messageQueue.shift();
            } catch (error) {
                if (error === 'No hay conexión a Internet' || error === 'conexión cerrada') {
               
                    console.log('Reintentando en 5 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else if (error === 'Sesión no existe'|| error ==="sesion cerrada") {
                    console.log('Problema de sesión, reenviando al final de la cola.');
                           console.log('Sesión inactiva o cerrada, moviendo el mensaje a pendientes.');
                           moverMensajesASesionPendiente(sessionId);
              
                } else {
                    console.log('Error desconocido, reintentando en 5 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        sending = false;
    });
};

exports.sendPendings = async () => {
    if (pendingMessages.length > 0) {
        messageQueue.push(...pendingMessages);
        pendingMessages = [];
        await exports.sendAll();
    }
};

exports.deletePendings = (sessionId) => {
    pendingMessages = pendingMessages.filter(m => m.sessionId !== sessionId);
};


exports.borrarQr = async (sessionId) => {
    const sessionFilePath = path.join(__dirname, `./sessions/auth_info_${sessionId}`);

    return new Promise((resolve, reject) => {
        fs.rm(sessionFilePath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Error al borrar la sesión:', err);
                reject(err);
            } else {
                console.log(`Sesión ${sessionId} eliminada correctamente.`);
                resolve();
            }
        });
    });
};

exports.verificarConexion= async(sessionId)=>{
    

    try {
        await verificarConexionInternet();

        if (!await verificarSesionActiva(sessionId)) {
            throw 'Sesión no existe';
 }

        const { state } = await useMultiFileAuthState(path.join(__dirname, `./sessions/auth_info_${sessionId}`));

        sock = clients[sessionId] || makeWASocket({
            auth: state,
           // printQRInTerminal: true
        });

    }catch(e){}
};