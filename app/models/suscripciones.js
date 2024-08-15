const connection = require('../database/connection');

class Subscriptions {

    static async insert() {
        try {
            const query = `
               CREATE TABLE subscriptions (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) DEFAULT "",
                    url VARCHAR(255) DEFAULT "",
                    image VARCHAR(255) DEFAULT "",
                    max_raffle INT DEFAULT 1000,
                    max_num INT DEFAULT 10000,
                    whatsapp BOOLEAN DEFAULT false,
                    banners BOOLEAN DEFAULT false,
                    email BOOLEAN DEFAULT false
                );

            `;
            const [results] = await connection.execute(query);
            return results;
        } catch (error) {
            console.error('Error creating notification table:', error);
            throw error;
        }
    }


    static async store(name,sub_id,url,image,max_raffle,max_num,whatsapp,banners,email) {
        try {
            const [results] = await connection.execute(
                `INSERT INTO subscriptions (  name, sub_id, url, image, max_raffle, max_num, whatsapp, banners , email) VALUES ( ?, ?, ?, ?, ?, ?, ?,?, ?)`,
                [  name, sub_id, url, image, max_raffle, max_num, whatsapp, banners,email]
            );
            return results;
        } catch (error) {
            console.error('Error inserting subscription:', error);
            throw error;
        }
    }

    // Método para obtener todas las suscripciones
    static async index() {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM subscriptions`
            );
            return results;
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            throw error;
        }
    }

    // Método para eliminar todas las suscripciones
    static async deleteAll() {
        try {
            const [results] = await connection.execute(
                `DELETE FROM subscriptions`
            );
            return results;
        } catch (error) {
            console.error('Error deleting subscriptions:', error);
            throw error;
        }
    }

    // Método para eliminar suscripciones basado en un campo específico
    static async delete(field, value) {
        try {
            const query = `DELETE FROM subscriptions WHERE ${field} = ?`;
            const [results] = await connection.execute(query, [value]);
            return results;
        } catch (error) {
            console.error(`Error deleting subscription where ${field} = ${value}:`, error);
            throw error;
        }
    }

}

module.exports = Subscriptions;
