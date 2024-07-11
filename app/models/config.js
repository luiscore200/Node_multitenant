require('dotenv').config();
const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Debe ser 32 bytes
const IV_LENGTH = 16; // Tamaño del vector de inicialización

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

class Config {
    constructor() {}


    static async create(){
        try {
            const configQuery = `
            CREATE TABLE IF NOT EXISTS config (
              id SERIAL PRIMARY KEY,
                 email VARCHAR(255) NULL,
                    email_password VARCHAR(255) NULL,
                       banner_1 VARCHAR(255) NULL,
                          banner_2 VARCHAR(255) NULL,
                            banner_3 VARCHAR(255) NULL,
                                app_logo VARCHAR(255) NULL,
                                   app_icon VARCHAR(255) NULL,
                                      app_name VARCHAR(255) NULL,
                                         raffle_count VARCHAR(255) NULL,
                                            raffle_number VARCHAR(255) NULL

            )

           
          `;
        
          const [results] = await connection.execute(configQuery);
            const assignQuery = `  INSERT INTO config (email, email_password, banner_1, banner_2, banner_3,app_logo, app_icon, app_name,raffle_count, raffle_number)
             VALUES ("", "", "", "", "", "","", "","","")`;
           //  const [results2] = await connection.execute(assignQuery);

        } catch (error) {
            throw error;
        }
    }

    // Método para obtener la configuración (index)
    static async index() {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM config WHERE id = 1`
            );

            if (results.length === 0) {
                throw new Error('No se encontró ninguna configuración');
            }
            const config = results[0];

            // Desencriptar y luego deshashear la contraseña de email si existe y no es NULL
            if (config.email_password && config.email_password !== null) {
                // Desencriptar la contraseña
                const decryptedPassword = decrypt(config.email_password);
                // Deshashear la contraseña
                config.email_password = decryptedPassword;
            }

            return config;
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar la configuración (update)
    static async update( updates) {
        try {
            const values = [];
            const fields = [];

            for (const [key, value] of Object.entries(updates)) {
                if (key === 'email_password') {
                    // Hashear la nueva contraseña
               //     const hashedPassword = await bcrypt.hash(value, 10);
                    // Encriptar la contraseña hasheada
                    const encryptedPassword = encrypt(value);
                    fields.push(`${key} = ?`);
                    values.push(encryptedPassword);
                } else {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            const sql = `UPDATE config SET ${fields.join(', ')} WHERE id = 1`;

            const [results] = await connection.execute(sql, values);
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Config;
