const fs = require('fs');
const path = require('path');
const psl = require('psl');
require('dotenv').config();


/**
 * Extrae el dominio limpio de una URL.
 * @param {Array} data - El resultado de ejecutar una expresión regular sobre una URL.
 * @returns {string|null} - El subdominio si existe, de lo contrario null.
 */
const subdomainsFilePath = path.join(__dirname, '../domains/subdominios.json');

const parseDomain = (data = []) => {
  try {
    return data[1];
  } catch (e) {
    return null;
  }
};

exports.checkDomain = async (req, res, next) => {
  try {
    const origin = req.get('origin');
    const re = /^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/ig;
    const result = re.exec(origin);
    const rawDomain = parseDomain(result);
    const clean = psl.parse(rawDomain);
    const subdomain = clean.subdomain;
    const mainDomain = process.env.MAIN_DOMAIN;

    if (clean.domain !== mainDomain) {
      return res.status(400).json({ error: 'Dominio principal no válido' });
    }

    if (subdomain) {
      // Leer el archivo de subdominios
      const data = fs.readFileSync(subdomainsFilePath);
      const subdomains = JSON.parse(data);

      // Verificar si el subdominio existe en la lista
      if (subdomains.includes(subdomain)) {
        req.clientAccount = subdomain;
        return next();
      } else {
        return res.status(400).json({ error: 'Subdominio no válido' });
      }
    } else {
      return res.status(400).json({ error: 'Subdominio no encontrado' });
    }
  } catch (error) {
    console.error('Error en checkDomain:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};