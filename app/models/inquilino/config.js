require('dotenv').config();
const connection = require('../../database/connection');
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

    // Método para obtener la configuración (index)
    static async index(propietario) {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM ${propietario}.config WHERE id = 1`
            );

            if (results.length === 0) {
                throw new Error('No se encontró ninguna configuración');
            }
            const config = results[0];

            // Desencriptar y luego deshashear la contraseña de email si existe y no es NULL
            if (config.password_email && config.password_email !== null) {
                // Desencriptar la contraseña
                const decryptedPassword = decrypt(config.password_email);
                // Deshashear la contraseña
                config.password_email = decryptedPassword;
            }

            config.phone_status= config.phone_status===0?false:true;
            config.phone_verified = config.phone_verified===0?false:true;
            config.email_status = config.email_status===0?false:true;
            config.email_verified = config.email_verified===0?false:true;

            return config;
        } catch (error) {
            throw error;
        }
    }

    // Método para actualizar la configuración (update)
    static async update(propietario, updates) {
        try {
            const values = [];
            const fields = [];

            for (const [key, value] of Object.entries(updates)) {
                if (key === 'password_email') {
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

            const sql = `UPDATE ${propietario}.config SET ${fields.join(', ')} WHERE id = 1`;

            const [results] = await connection.execute(sql, values);
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Config;
