const connection = require('../database/connection');
const bcrypt = require('bcrypt');

class User {
  constructor() {}

  static async crearTabla() {
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS  users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          domain VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(255 ) NOT NULL ,
          email VARCHAR(255) NOT NULL UNIQUE,
          country VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          status BOOLEAN NOT NULL  DEFAULT '0',
          role VARCHAR(255) NOT NULL  DEFAULT 'user' CHECK (role IN ('user', 'admin')), 
          payed BOOLEAN NOT NULL DEFAULT '0'
        )
      `);
      console.log('Tabla  users creada o ya existente');
    } catch (error) {
      console.error('Error al crear la tabla  users:', error);
      throw error;
    }
  }


  static async crear(name,domain, phone, email , country, password, role,  status, payed) {
    let localStatus;
    let localRole;
    let localPassword;
    let localPayed;
    try {
      if(role && role=="admin"||role=="user"){
        localRole=role;
      }else{
        localRole="user";
      }
      if(password &&  password != null){
        localPassword=password;
        
      }else{
        localPassword="password";
      }

      if(status==true || status==false ){
        localStatus = status;
      }else{
        localStatus = true;
      }
      if(payed==true || payed==false ){
        localPayed = payed;
      }else{
        localPayed = true;
      }

      const hashedPassword = await hashPassword(localPassword);
      const [results] = await connection.execute('INSERT INTO  users (name, domain, phone, email, country, password, status, role, payed) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)',
         [name, domain, phone, email, country, hashedPassword, localStatus, "user", localPayed]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const [results] = await connection.execute('DELETE FROM  users WHERE id = ?', [id]);
      return results;
    } catch (error) {
      throw error;
    }
  }
  
  
  

  static async index() {
    try {
      const [results] = await connection.execute('SELECT * FROM  users');
      
      return results;
    } catch (error) {
      throw error;
    }
  }

 
  static async find(key, value) {
    try {
      const [results] = await connection.execute(`SELECT * FROM  users WHERE ${key} = ?`, [value]);
    
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  
  

  static async update(id, updates) {
    try {
      const fields = [];
      const values = [];

      // Iterar sobre las propiedades del objeto updates
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'password') {
          const hashedPassword = await hashPassword(value);
          fields.push('password = ?');
          values.push(hashedPassword);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      values.push(id);

      const sql = `UPDATE  users SET ${fields.join(', ')} WHERE id = ?`;

      const [results] = await connection.execute(sql, values);
      return results;
    } catch (error) {
      throw error;
    }
  }
}





async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear la contraseña: ' + error.message);
  }
}

module.exports = User;
