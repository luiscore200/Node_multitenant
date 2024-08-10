require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const dns = require('dns');
const Config = require('../models/config');
const notificaciones = require("../models/notificaciones");

// Configura el transporte usando las variables de entorno para Mailtrap

let messageQueue = [];

let sending = false;
let email;
let transporter;

const credentials = async () => {
    try {
        const response = await Config.index();
        console.log(response);
        email = response.email;
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: response.email,
                pass: response.email_password,
            },
        });
    } catch (error) {
        console.log('Error al obtener las credenciales: ', error);
        throw error;
    }
};

if (!transporter) {
    credentials().then(() => {
        console.log('Credenciales cargadas y transporter inicializado.');
    }).catch((error) => {
        console.log('No se pudieron cargar las credenciales: ', error.message);
    });
}


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
    
};

exports.Init = async()=>{
    credentials();
}

// Función para enviar correos electrónicos
exports.sendMail = async (to, subject, html) => {
   



  try {
    await   verificarConexionInternet();

    if (!transporter) {
        await credentials();
    }
    let mailOptions = {
      from: email,
      to,
      subject,
      html,
    };

    let info = await sendWithTimeout(transporter,mailOptions,10000);
    console.log('Correo enviado: ' + info.response);
  } catch (error) {
    console.log(error);
    //console.error('Error al enviar el correo: ', error);
         if (error === 'No hay conexión a Internet'){
            console.log(error);
           throw error;
         }
         if (error.code && error.code === 'EAUTH' && error.responseCode === 535) {
            console.log('No estás autorizado para enviar correos electrónicos. Verifica tus credenciales o permisos.');
            // Aquí puedes agregar lógica adicional de notificación o manejo de errores
            throw "No autorizado";
        }

  }
};


exports.sendAll = async () => {
    if (sending) {
        return;
    }

    limpiarMensajesAntiguos();

    sending = true;

    setImmediate(async () => {
        while (messageQueue.length > 0) {
            const { to, subject, html } = messageQueue[0];

            try {
                await exports.sendMail(to, subject, html);
                messageQueue.shift();
            } catch (error) {
                if (error === 'No hay conexión a Internet' ) {
               
                    console.log('Reintentando en 10 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 10000));
                } else if (error === 'No autorizado') {
                    console.log('Problema de sesión, reenviando al final de la cola.');
                           console.log('No autorizado, se notificara y reintentara cada media hora....');
                           notificar();
                         //  transporter=null;
                           await new Promise(resolve => setTimeout(resolve, 1800000));
              
                } else {
                    console.log('Error desconocido, reintentando en 5 segundos...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        sending = false;
    });
};



exports.addMessageToQueue = ( to, subject, html) => {
    messageQueue.push({to, subject,html, createdAt: Date.now()  });
};


// Función para enviar correos electrónicos con el QR en el cuerpo del mensaje
exports.sendMailWithQR = async (to, subject, qrImagePath) => {
  try {
    if (!transporter) {
        await credentials();
    }
      // Lee la imagen del QR como base64
      const qrImage = fs.readFileSync(qrImagePath, { encoding: 'base64' });

      // Crea el contenido HTML del correo con la imagen del QR embebida
      const html = `
          <html>
          <head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f6f6f6;
                      margin: 0;
                      padding: 0;
                      -webkit-font-smoothing: antialiased;
                      -webkit-text-size-adjust: none;
                  }
                  table {
                      width: 100%;
                      margin: 20px 0;
                      background-color: #fff;
                      border-radius: 8px;
                      overflow: hidden;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h2 {
                      color: #333;
                  }
                  p {
                      color: #555;
                  }
                  .header {
                      background-color: #4CAF50;
                      color: white;
                      text-align: center;
                      padding: 10px 0;
                  }
                  .content {
                      padding: 20px;
                  }
                  .qr-code {
                      text-align: center;
                      margin-top: 20px;
                  }
                  .footer {
                      background-color: #f1f1f1;
                      text-align: center;
                      padding: 10px;
                      font-size: 12px;
                      color: #888;
                  }
              </style>
          </head>
          <body>
              <table align="center">
                  <tr>
                      <td class="header">
                          <h1>QR Code</h1>
                      </td>
                  </tr>
                  <tr>
                      <td class="content">
                        
                          <p>Escanea el siguiente código QR:</p>
                          <p>Tenga en cuenta que este codigo se actualiza aproximadamente cada 30 segundos, por lo cual debe </br> tener el celular a la mano a la hora de solicitarlo <p>
                          <div class="qr-code">
                              <img src="cid:qrImage" alt="QR Code">
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td class="footer">
                          <p>Este es un correo generado automáticamente. No responda a este correo.</p>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
      `;

      let mailOptions = {
          from: email,
          to,
          subject,
          html,
          attachments: [{
              filename: 'qr_image.png',
              content: qrImage,
              encoding: 'base64',
              cid: 'qrImage'
          }]
      };

      let info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: ' + info.response);
  } catch (error) {
      console.error('Error al enviar el correo: ', error);
  }
};


const notificar = async(dominio)=>{
    await notificaciones.insert();
    await notificaciones.deleteOld();
    await notificaciones.deleteFrom("code",302);
    await notificaciones.deleteFrom("code",303);
    await notificaciones.store({description:"Se ha desactivado Gmail por fallas de sesion, presione para configurar",type:"configuracion",code:302});
    await notificaciones.store({description:"Se han encolado los mensajes, luego de un dia seran eliminados",type:"sistema",code:303});

}
