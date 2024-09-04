exports.rifaGanador = (user, premio, index) => {
  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #4CAF50;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
          margin: 10px 0;
        }
        .highlight {
          color: #4CAF50;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Felicidades ${user.purchaser_name}!</h1>
        </div>
        <div class="content">
          <p>¡Has ganado en nuestra rifa!</p>
          <p>El día <span class="highlight">${premio[index].fecha}</span></p>
          <p>la lotería <span class="highlight">${premio[index].loteria}</span> jugó con el número <span class="highlight">${premio[index].ganador}</span>.</p>
          <p>Esto te ha dado la oportunidad de ganar <span class="highlight">${premio[index].descripcion}</span>.</p>
        </div>
        <div class="footer">
          <p>Gracias por jugar con nosotros.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.rifaGanadorDeudor = (user, premio, index) => {
  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #FF7043;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
          margin: 10px 0;
        }
        .highlight {
          color: #FF7043;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .note {
          color: #FFA726;
          font-weight: bold;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Tu número ha jugado, ${user.purchaser_name}!</h1>
        </div>
        <div class="content">
          <p>Queremos informarte que el día <span class="highlight">${premio[index].fecha}</span>,</p>
          <p>la lotería <span class="highlight">${premio[index].loteria}</span> jugó con el número <span class="highlight">${premio[index].ganador}</span>.</p>
          <p>Esto te habría dado la oportunidad de ganar <span class="highlight">${premio[index].descripcion}</span>.</p>
          <p class="note">Sin embargo, como tu pago no se encuentra confirmado en nuestra base de datos, no podemos asignarte el premio en este momento.</p>
          <p>Te invitamos a confirmar tu pago a tiempo para poder participar en los próximos sorteos y tener la oportunidad de ganar premios increíbles.</p>
        </div>
        <div class="footer">
          <p>Gracias por participar en nuestra rifa.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.rifaNoGanador = (user, premio, index) => {
  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #4CAF50;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
          margin: 10px 0;
        }
        .highlight {
          color: #4CAF50;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡La rifa ya jugó!</h1>
        </div>
        <div class="content">
          <p>Hola ${user.purchaser_name},</p>
          <p>Se te informa que el premio que jugaba el <span class="highlight">${premio[index].fecha}</span> con la lotería <span class="highlight">${premio[index].loteria}</span> ha jugado con el número <span class="highlight">${premio[index].ganador}</span>.</p>
          <p>Lamentablemente no has escogido ese número, pero te invitamos a seguir participando.</p>
          <p>¡El próximo podrías ser tú!</p>
        </div>
        <div class="footer">
          <p>Gracias por jugar con nosotros.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.rifaConfirmacionNumero = (asignacion, premios2) => {
  let premiosHTML = '';
  const premios = premios2;

  if (Array.isArray(premios)) {
    premiosHTML = premios.map(premio => {
      return `
        <div class="premio">
          <p><span class="highlight">Descripción:</span> ${premio.descripcion}</p>
          <p><span class="highlight">Lotería:</span> ${premio.loteria}</p>
          <p><span class="highlight">Fecha:</span> ${premio.fecha}</p>
        </div>`;
    }).join('');
  } else {
    premiosHTML = '<p>No se encontraron premios válidos.</p>';
  }
  

  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #4CAF50;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
        }
        .highlight {
          color: #4CAF50;
          font-weight: bold;
        }
        .premio {
          border: 1px solid #ddd;
          padding: 10px;
          margin: 10px 0;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .note {
          color: #FFA726;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Confirmación de tu transacción, ${asignacion.purchaser_name}!</h1>
        </div>
        <div class="content">
          <p>Hemos confirmado tu transacción en valor a la compra del número <span class="highlight">${asignacion.number}</span>.</p>
          <p>Este número es válido para la rifa de los siguientes premios:</p>
          ${premiosHTML}
          <p>Recuerda que para poder reclamar un premio en específico, tu número debe haber sido confirmado antes de que juegue la lotería. De no ser así, dicho premio no podrá ser asignado.</p>
        </div>
        <div class="footer">
          <p>Gracias por participar en nuestra rifa y ¡buena suerte!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.rifaInvitacion = (comprador, currentRifa, url) => {
  const premios = currentRifa.prizes.map(premio => {
    return `
      <li>
        <strong>${premio.descripcion}</strong> - ${premio.loteria} (Fecha: ${premio.fecha})
      </li>`;
  }).join('');

  return `
 <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
      padding: 20px;
      margin: 0;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px;
      background: #4CAF50;
      color: #fff;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      margin: 10px 0;
    }
    .highlight {
      color: #4CAF50;
      font-weight: bold;
    }
    .button-container {
      text-align: center;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      color: #fff;
      background-color: #007BFF;
      text-align: center;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #777;
      background: #f1f1f1;
      border-radius: 0 0 10px 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡¿Preparado para probar tu suerte?!</h1>
    </div>
    <div class="content">
      <p>Te invitamos a participar en nuestra rifa: <strong>${currentRifa.tittle}</strong></p>
      <p><strong>Detalles de la rifa:</strong></p>
      <ul>
        <li><strong>Precio:</strong> ${currentRifa.price}</li>
        <li><strong>País:</strong> ${currentRifa.country}</li>
        <li><strong>Números disponibles:</strong> ${currentRifa.numbers}</li>
        <li><strong>Tipo:</strong> ${currentRifa.type}</li>
        ${premios}
      </ul>
      <p>Haz clic en el siguiente botón para obtener más información y participar:</p>
      <div class="button-container">
        <a href="${url}" class="button"><p style="color:white;">Participar en la rifa</p></a>
      </div>
      <p>¡No pierdas esta oportunidad de ganar increíbles premios!</p>
    </div>
    <div class="footer">
      <p>Gracias por tu interés y ¡buena suerte!</p>
    </div>
  </div>
</body>
</html>`;
};


exports.rifaRecordatorioPago = (asignacion, premios2) => {
  let premiosHTML = '';
  const premios = premios2;

  if (Array.isArray(premios)) {
    premiosHTML = premios.map(premio => {
      return `
        <div class="premio">
          <p><span class="highlight">Descripción:</span> ${premio.descripcion}</p>
          <p><span class="highlight">Lotería:</span> ${premio.loteria}</p>
          <p><span class="highlight">Fecha:</span> ${premio.fecha}</p>
        </div>`;
    }).join('');
  } else {
    premiosHTML = '<p>No se encontraron premios válidos.</p>';
  }
  
  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #FF7043;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
        }
        .highlight {
          color: #FF7043;
          font-weight: bold;
        }
        .premio {
          border: 1px solid #ddd;
          padding: 10px;
          margin: 10px 0;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .note {
          color: #FFA726;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Recordatorio de Pago, ${asignacion.purchaser_name}!</h1>
        </div>
        <div class="content">
          <p>Te recordamos que tienes números pendientes de pago. Para hacer válida tu participación en la rifa, por favor cancela el valor de los numeros pendientes.</p>
         
          <p>Estos números serán válidos para la rifa de los siguientes premios:</p>
          ${premiosHTML}
          <p class="note">Recuerda que si no realizas el pago, no podrás participar en la rifa ni reclamar premios con los numeros correspondientes.</p>
        </div>
        <div class="footer">
          <p>Gracias por tu atención y te esperamos para que completes tu participación en nuestra rifa.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.asignacionEliminadaGmail = (datos, rifa) => {
  let premiosHTML = '';

  if (Array.isArray(rifa.premios) && rifa.premios.length > 0) {
    premiosHTML = rifa.premios.map(premio => {
      return `
        <div class="premio">
          <p><span class="highlight">Descripción:</span> ${premio.descripcion}</p>
          <p><span class="highlight">Lotería:</span> ${premio.loteria}</p>
          <p><span class="highlight">Fecha:</span> ${premio.fecha}</p>
        </div>`;
    }).join('');
  } else {
    premiosHTML = '<p>No se encontraron premios válidos para esta rifa.</p>';
  }

  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          line-height: 1.6;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
        }
        .header h1 {
          color: #FF5722;
        }
        .content {
          text-align: center;
        }
        .content p {
          font-size: 16px;
        }
        .highlight {
          color: #FF5722;
          font-weight: bold;
        }
        .premio {
          border: 1px solid #ddd;
          padding: 10px;
          margin: 10px 0;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #777;
        }
        .note {
          color: #FF5722;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Notificación de Eliminación</h1>
        </div>
        <div class="content">
          <p>Estimado/a ${datos.purchaser_name},</p>
          <p>Le informamos que su asignación número <span class="note">${datos.number}</span> en la rifa <span class="highlight">${rifa.nombre}</span> ha sido eliminada.</p>
          <p>Esta rifa cuenta con los siguientes premios:</p>
          ${premiosHTML}
          <p>Este mensaje es automático. Si tiene alguna duda o consulta sobre esta situación, por favor, póngase en contacto con su proveedor.</p>
        </div>
        <div class="footer">
          <p>Gracias por su comprensión.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
