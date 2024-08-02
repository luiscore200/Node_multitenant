const connection = require('../../database/connection');

class Notifications {

    static async store(propietario, value) {
        try {
            const [results] = await connection.execute(
                `INSERT INTO ${propietario}.notification (description, type, code) VALUES (?, ?, ?)`,
                [value.description, value.type,value.code]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async index(propietario) {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM ${propietario}.notification`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async delete(propietario) {
        try {
            const [results] = await connection.execute(
                `DELETE FROM ${propietario}.notification`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    
    static async deleteFrom(propietario, field, value) {
        try {
            const query = `DELETE FROM ${propietario}.notification WHERE ${field} = ?`;
            const [results] = await connection.execute(query, [value]);
            return results;
        } catch (error) {
            throw error;
        }
    }



    static async deleteOld(propietario) {
        try {
            const [results] = await connection.execute(
                `DELETE FROM ${propietario}.notification WHERE created_at < NOW() - INTERVAL 1 DAY`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Notifications;
