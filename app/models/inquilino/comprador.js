const connection = require('../../database/connection');

class Purchaser {
    constructor() {}

    static async store(propietario, name, email, phone, document) {
        try {
            const [results] = await connection.execute(
                `INSERT INTO ${propietario}.purchaser (name, email, phone, document) VALUES (?, ?, ?, ?)`,
                [name, email, phone, document]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(propietario, id) {
        try {
            const [results] = await connection.execute(
                `DELETE FROM ${propietario}.purchaser WHERE id = ?`,
                [id]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async index(propietario) {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM ${propietario}.purchaser`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async find(propietario, key, value) {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM ${propietario}.purchaser WHERE ${key} = ?`,
                [value]
            );
            if (results.length === 0) {
                throw new Error(`No se encontró ningún comprador con ${key} = ${value}`);
            }
            return results;
        } catch (error) {
           // throw error;
        }
    }

    static async update(propietario, id, updates) {
        try {
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(updates)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            values.push(id);

            const sql = `UPDATE ${propietario}.purchaser SET ${fields.join(', ')} WHERE id = ?`;

            const [results] = await connection.execute(sql, values);
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Purchaser;
