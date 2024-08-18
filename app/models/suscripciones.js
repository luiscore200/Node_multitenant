const connection = require('../database/connection');

class Subscriptions {

    static async insert() {
        try {
            const query = `
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sub_id VARCHAR(255) DEFAULT "",
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

    static async update(id, updates) {
        try {
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(updates)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }

            values.push(id);

            const sql = `UPDATE subscriptions SET ${fields.join(', ')} WHERE id = ?`;

            const [results] = await connection.execute(sql, values);
            return results;
        } catch (error) {
            throw error;
        }
    }

     
  static async find(key, value) {
    try {
      const [results] = await connection.execute(`SELECT * FROM  subscriptions WHERE ${key} = ?`, [value]);
    
      const result = results[0];
      result.whatsapp = result.whatsapp===0?false:true;
      result.banners = result.banners===0?false:true;
      result.email = result.email===0?false:true;

      return result;
      
    } catch (error) {
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
