const connection = require('../../database/connection');

class Rifa {
   
  constructor() {
  
  }
  

    
  static async store(propietario, titulo, precio, pais,imagen, numeros, tipo, premios) {
    
    try {
      const [results] = await connection.execute(
        `INSERT INTO ${propietario}.raffle (tittle, price, country, image, numbers, type, prizes) VALUES (?, ?, ?,?,?, ?, ?)`,
        [titulo,precio, pais,imagen, numeros, tipo, JSON.stringify(premios)]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

 static async eliminar(propietario,id) {
    try {
      const [results] = await connection.execute(
        `DELETE FROM ${propietario}.raffle WHERE id = ?`,
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
        `SELECT * FROM ${propietario}.raffle`
      );
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async find(propietario,key, value) {
    try {
      const [results] = await connection.execute(
        `SELECT * FROM ${propietario}.raffle WHERE ${key} = ?`,
        [value]
      );
      
      return results[0];
    } catch (error) {
      throw error;
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

        const sql = `UPDATE ${propietario}.raffle SET ${fields.join(', ')} WHERE id = ?`;

        const [results] = await connection.execute(sql, values);
        return results;
    } catch (error) {
        throw error;
    }
}
}


module.exports = Rifa;
