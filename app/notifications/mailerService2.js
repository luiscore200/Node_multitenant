require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dns = require('dns');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Debe ser 32 bytes
const IV_LENGTH = 16; // Tamaño del vector de inicialización


let messageQueue = [];
let pendingMessages = [];
let sending = false;

// Función para cifrar un valor
const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Función para descifrar un valor
const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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

const sendWithTimeout = (transporter, mailOptions, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Tiempo de espera agotado'));
        }, timeout);

        transporter.sendMail(mailOptions, (err, info) => {
            clearTimeout(timer);
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
};


const limpiarMensajesAntiguos = () => {
    const unDia = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const ahora = Date.now();

    messageQueue = messageQueue.filter(m => (ahora - m.createdAt) < unDia);
    pendingMessages = pendingMessages.filter(m => (ahora - m.createdAt) < unDia);
};

const moverMensajesASesionPendiente = (domain) => {
    const mensajesPendientes = messageQueue.filter(m => m.domain === domain);
    pendingMessages.push(...mensajesPendientes.map(m => ({ ...m, createdAt: Date.now() })));
    messageQueue = messageQueue.filter(m => m.domain !== domain);
};

// Función para eliminar el transporter existente del propietario
const borrado = (propietario) => {
    sessions = sessions.filter(sess => sess.propietario !== propietario);
    actualizarJson();
    console.log(`Transporter eliminado para ${propietario}.`);
};




// Ruta del archivo JSON
const jsonFilePath = path.join(__dirname, '../utils/emailList.json');

// Array de sesiones
let sessions = [];

// Cargar datos del JSON al iniciar
try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonParsed = JSON.parse(jsonData);

    // Convertir los datos del JSON al formato sessions con transporter nulo y descifrar los valores
    sessions = jsonParsed.map(item => ({
        propietario: item.propietario,
        email: decrypt(item.email),
        password: decrypt(item.password),
        transporter: null
    }));

    console.log('Datos del JSON cargados correctamente.');
} catch (error) {
    console.error('Error al cargar datos del JSON:', error.message);
}

// Función para crear transporter
const createTransporter = (email, password) => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        },
    });
};

exports.addMessageToQueue = (domain, to, subject, html) => {
    messageQueue.push({ domain, to, subject, html, createdAt: Date.now()  });
};


// Función para enviar correos electrónicos
exports.sendMail = async (propietario, to, subject, html) => {
    await verificarConexionInternet();



    let transporterObj = sessions.find(obj => obj.propietario === propietario);

    if (!transporterObj) {
        throw new Error(`No se encontró transporter para ${propietario}`);
    }

    // Si el transporter no existe, crearlo
    if (!transporterObj.transporter) {
        transporterObj.transporter = createTransporter(transporterObj.email, transporterObj.password);
    }

    const { transporter,email } = transporterObj;

    try {
        let mailOptions = {
           // from: process.env.EMAIL_FROM,
           from:email,
            to,
            subject,
            html,
        };

        let info = await sendWithTimeout(transporter, mailOptions, 10000);
       

        console.log('Correo enviado: ' + info.response);
        return 'Correo enviado: ' + info.response;
    } catch (error) {

        if (error === 'No hay conexión a Internet'){
            console.log(error);
           throw error;
         }else if (error.code && error.code === 'EAUTH' && error.responseCode === 535) {
            console.log('No estás autorizado para enviar correos electrónicos. Verifica tus credenciales o permisos.');
            // Aquí puedes agregar lógica adicional de notificación o manejo de errores
            throw "No autorizado";
        }else{
             console.log(error.message);
             throw "Error desconocido";
        }
    }
};

// Función para actualizar el archivo JSON con el nuevo estado de sessions
const actualizarJson = () => {
    // Solo guardar propietario, email y password cifrados en el JSON
    const jsonContent = JSON.stringify(sessions.map(({ propietario, email, password }) => ({
        propietario,
        email: encrypt(email),
        password: encrypt(password)
    })), null, 2);
    fs.writeFileSync(jsonFilePath, jsonContent);
    console.log('JSON actualizado:', jsonContent);
};


exports.sendAll = async () => {
    if (sending) {
        return;
    }

    limpiarMensajesAntiguos();

    sending = true;

    setImmediate(async () => {
        while (messageQueue.length > 0) {
            const { domain, to, subject,html } = messageQueue[0];

            try {
                await exports.sendMail(domain, to, subject, html);
                messageQueue.shift();
            } catch (error) {
                if (error === 'No hay conexión a Internet' ) {
               
                    console.log('Reintentando en 10 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else if (error === 'No autorizado') {
                    console.log('Problema de sesión, reenviando al final de la cola.');
                           console.log('Sesión inactiva o cerrada, moviendo el mensaje a pendientes.');
                           moverMensajesASesionPendiente(domain);
              
                } else {
                    console.log('Error desconocido, reintentando en 10 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        sending = false;
    });
};



// Función para verificar y almacenar el transporter
exports.verifyEmail = async (propietario, email, password) => {
    try {
        borrado(propietario);

        // Crear el transporter para el propietario
        const transporter = createTransporter(email, password);

        // Agregar el objeto { propietario, transporter, email, password } al array sessions
        sessions.push({ propietario, transporter, email, password });

        // Enviar un correo de prueba usando el transporter creado
        const enviadoExitosamente = await exports.sendMail( propietario,`${email}`, "Verificación de Email", "Este es un correo de prueba para verificar la dirección de email.");

        if (enviadoExitosamente) {
            // Actualizar el JSON con el nuevo estado de sessions
            actualizarJson();
            console.log(`Transporter creado y guardado para ${propietario}.`);
            return "Confirmación exitosa";
        } else {
            // Si el envío del correo de prueba falla, eliminar el transporter y lanzar un error
            borrado(propietario);
            throw new Error("No se pudo enviar el correo de prueba");
        }
    } catch (error) {
        // Manejar cualquier error durante el proceso
        console.error('Error al verificar y almacenar el transporter:', error.message);
        borrado(propietario); // Eliminar el transporter en caso de error
        throw new Error("Error al confirmar");
    }
};

exports.sendPendings = async () => {
    if (pendingMessages.length > 0) {
        messageQueue.push(...pendingMessages);
        pendingMessages = [];
        await exports.sendAll();
    }
};

exports.deletePendings = (domain) => {
    pendingMessages = pendingMessages.filter(m => m.domain !== domain);
};
