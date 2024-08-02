const connection = require('../database/connection');

class Notifications {

    static async insert() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS notification (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    description VARCHAR(255) NOT NULL,
                    type VARCHAR(100) NOT NULL,
                    code INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            const [results] = await connection.execute(query);
            return results;
        } catch (error) {
            console.error('Error creating notification table:', error);
            throw error;
        }
    }


    static async store( value) {
        try {
            const [results] = await connection.execute(
                `INSERT INTO notification (description, type, code) VALUES (?, ?, ?)`,
                [value.description, value.type,value.code]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async index() {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM notification`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async delete() {
        try {
            const [results] = await connection.execute(
                `DELETE FROM notification`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    
    static async deleteFrom(field, value) {
        try {
            const query = `DELETE FROM notification WHERE ${field} = ?`;
            const [results] = await connection.execute(query, [value]);
            return results;
        } catch (error) {
            throw error;
        }
    }



    static async deleteOld() {
        try {
            const [results] = await connection.execute(
                `DELETE FROM notification WHERE created_at < NOW() - INTERVAL 1 DAY`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Notifications;
