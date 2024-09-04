exports.rifaGanadorWhatsApp = (user, premio, index) => {
    return `
      *¡Felicidades ${user.purchaser_name}!*

Has ganado en nuestra rifa.

🎉 *Fecha*: ${premio[index].fecha}
🎉 *Lotería*: ${premio[index].loteria}
🎉 *Número ganador*: ${premio[index].ganador}
🎉 *Premio*: ${premio[index].descripcion}

Gracias por jugar con nosotros.
`;
  };

  exports.rifaGanadorDeudorWhatsApp = (user, premio, index) => {

        return `
           *¡Tu número ha jugado, ${user.purchaser_name}!*

Queremos informarte que:

📅 *Fecha*: ${premio[index].fecha}
🎲 *Lotería*: ${premio[index].loteria}
🔢 *Número ganador*: ${premio[index].ganador}
🎁 *Premio*: ${premio[index].descripcion}

_Sin embargo, como tu pago no se encuentra confirmado, no podemos asignarte el premio en este momento._

Te invitamos a confirmar tu pago a tiempo para poder participar en los próximos sorteos y tener la oportunidad de ganar premios increíbles.
`;

      };
      
  
  
  exports.rifaNoGanadorWhatsApp = (user, premio, index) => {
    
   return `
*¡La rifa ya jugó!*

Hola ${user.purchaser_name},

Se te informa que:

📅 *Fecha*: ${premio[index].fecha}
🎲 *Lotería*: ${premio[index].loteria}
🔢 *Número ganador*: ${premio[index].ganador}

_Lamentablemente no has escogido ese número, pero te invitamos a seguir participando._

¡El próximo podrías ser tú!

Gracias por jugar con nosotros.
`;
  };
  
  
  exports.rifaConfirmacionNumeroWhatsApp = (asignacion, premios2) => {
    const premios = premios2;
  let premiosTexto = '';

  if (Array.isArray(premios)) {
    premiosTexto = premios.map(premio => {
      return `
        📌 *Descripción*: ${premio.descripcion}
        📅 *Lotería*: ${premio.loteria}
        📅 *Fecha*: ${premio.fecha}
`;
    }).join('');
  } else {
    premiosTexto = 'No se encontraron premios válidos.';
  }

  return `
*¡Confirmación de tu transacción, ${asignacion.purchaser_name}!*

Hemos confirmado tu transacción para el número: ${asignacion.number}.

Este número es válido para la rifa de los siguientes premios:

${premiosTexto}

Recuerda que para poder reclamar un premio en específico, tu número debe haber sido confirmado antes de que juegue la lotería. De no ser así, dicho premio no podrá ser asignado.

Gracias por participar en nuestra rifa y ¡buena suerte!
`;
  };





  exports.rifaRecordatorioPagoWhatsApp = (asignacion, premios2) => {
    const premios = premios2;
    let premiosTexto = '';
  
    if (Array.isArray(premios)) {
      premiosTexto = premios.map(premio => {
        return `
          📌 *Descripción*: ${premio.descripcion}
          🎟️ *Lotería*: ${premio.loteria}
          📅 *Fecha*: ${premio.fecha}
  `;
      }).join('');
    } else {
      premiosTexto = 'No se encontraron premios válidos.';
    }
  
    return `
  *¡Recordatorio de Pago, ${asignacion.purchaser_name}!*
  
  Tienes números pendientes de pago.
  
  Para hacer válida tu participación en la rifa, debes cancelar el valor de estos números.
  
  Estos números serán válidos para la rifa de los siguientes premios:
  
  ${premiosTexto}
  
  ⚠️ *Recuerda*: Si no realizas el pago, no podrás participar en la rifa ni reclamar premios con los numeros correspondientes.
  
  Gracias por tu atención, esperamos que completes tu participación pronto.
  `;
  };
  




  
  exports.invitacionRifaWhatsApp = (comprador, currentRifa, url) => {
    const premios = currentRifa.prizes.map((premio, index) => {
        return `🏆 *Premio ${index + 1}*: ${premio.descripcion} - ${premio.loteria} (Fecha: ${premio.fecha})`;
    }).join('\n');

   

    return `
*¡Hola ${comprador.name}!*

Te invitamos a participar en nuestra emocionante rifa: *${currentRifa.tittle}* 🎉

💵 *Precio*: ${currentRifa.price}
🌍 *País*: ${currentRifa.country}
${premios}

Haz clic en el siguiente enlace para obtener más información y participar:

🔗  ${url}

¡No pierdas esta oportunidad de ganar increíbles premios!
`;
};


exports.asignacionEliminadaWhatsApp = (datos) => {
  return `
*Notificación de Eliminación*

Estimado/a *${datos.purchaser_name}*,

Le informamos que su asignación número *${datos.number}* ha sido eliminada.

Este mensaje es automático. Si tiene alguna duda o consulta sobre esta situación, por favor, póngase en contacto con su proveedor.

Gracias por su comprensión.
  `;
};
