exports.validateUpdateAdminConfig = (body) => {
  const { email, email_password, app_name, banner_1, banner_2, banner_3, app_logo, app_icon} = body;

  if (email) {
    if (typeof email !== "string") {
      return 'Se esperaba recibir un string en el campo Correo electrónico';
    }
    if (!validateEmail(email)) {
      return 'Formato de correo electrónico inválido';
    }
  }

  if (email_password && typeof email_password !== 'string') {
    return 'Se esperaba recibir un string en el campo contraseña';
  }

  if (app_name && typeof app_name !== 'string') {
    return 'Se esperaba recibir un string en el campo App Nombre';
  }

  if (banner_1 && typeof banner_1 !== 'string') {
    return 'Se esperaba recibir un string en el campo Banner 1';
  }

  if (banner_2 && typeof banner_2 !== 'string') {
    return 'Se esperaba recibir un string en el campo Banner 2';
  }

  if (banner_3 && typeof banner_3 !== 'string') {
    return 'Se esperaba recibir un string en el campo Banner 3';
  }

  if (app_logo && typeof app_logo !== 'string') {
    return 'Se esperaba recibir un string en el campo App Logo';
  }

  if (app_icon && typeof app_icon !== 'string') {
    return 'Se esperaba recibir un string en el campo App Icono';
  }

  if (subcriptions) {
    if (typeof subcriptions !== "string") {
      return 'Se esperaba recibir un string en el campo suscripciones';
    }
    let sub;
    try {
      sub = JSON.parse(subcriptions);
    } catch (error) {
      return 'Formato de suscripciones inválido';
    }

    if (!Array.isArray(sub)) {
      return 'Suscripciones debe ser un array de suscripciones';
    }

    for (let i = 0; i < sub.length; i++) {
      const obj = sub[i];

      if (obj.id && isNaN(Number(obj.id))) {
        return `ID en el objeto suscripción[${i}] debe ser un número`;
      }

      if (obj.max_raffle && isNaN(Number(obj.max_raffle))) {
        return `Máximo de rifas en el objeto suscripción[${i}] debe ser un número`;
      }

      if (obj.max_num && isNaN(Number(obj.max_num))) {
        return `Máximo de números en el objeto suscripción[${i}] debe ser un número`;
      }

      if (obj.name && typeof obj.name !== "string") {
        return `Nombre en el objeto suscripción[${i}] debe ser un string`;
      }

      if (obj.image && typeof obj.image !== "string") {
        return `Imagen en el objeto suscripción[${i}] debe ser un string`;
      }

      if (obj.url && typeof obj.url !== "string") {
        return `URL en el objeto suscripción[${i}] debe ser un string`;
      }

      if (obj.whatsapp !== undefined && typeof obj.whatsapp !== "boolean") {
        return `Whatsapp en el objeto suscripción[${i}] debe ser un booleano`;
      }

      if (obj.banners !== undefined && typeof obj.banners !== "boolean") {
        return `Banners en el objeto suscripción[${i}] debe ser un booleano`;
      }

      if (obj.email !== undefined && typeof obj.email !== "boolean") {
        return `Email en el objeto suscripción[${i}] debe ser un booleano`;
      }

      if (obj.share !== undefined && typeof obj.share !== "boolean") {
        return `Compartir en el objeto suscripción[${i}] debe ser un booleano`;
      }
    }
  }

  return null;
};

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
