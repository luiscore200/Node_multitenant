const connection = require('../database/connection');
const bcrypt = require('bcrypt');

class Inquilino {
  constructor() {}

  static async crearTabla() {
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS inquilinos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          status BOOLEAN,
          role VARCHAR(255) NOT NULL
        )
      `);
      console.log('Tabla inquilinos creada o ya existente');
    } catch (error) {
      console.error('Error al crear la tabla inquilinos:', error);
      throw error;
    }
  }


  static async crear(nombre, email, password, role) {
    let localRole;
    let localPassword;
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
      const hashedPassword = await hashPassword(localPassword);
      const [results] = await connection.execute('INSERT INTO inquilinos (nombre, email, password, status, role) VALUES (?, ?, ?, ?, ?)', [nombre, email, hashedPassword, true, localRole]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const [results] = await connection.execute('DELETE FROM inquilinos WHERE id = ?', [id]);
      return results;
    } catch (error) {
      throw error;
    }
  }
  
  
  static async administrador(id) {
    try {
      const [results] = await connection.execute('UPDATE inquilinos SET role = ? WHERE id = ?', ["admin", id]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async usuario(id) {
    try {
      const [results] = await connection.execute('UPDATE inquilinos SET role = ? WHERE id = ?', ["user", id]);
      return results;
    } catch (error) {
      throw error;
    }
  }
  

   static async activar(id) {
    try {
      const [results] = await connection.execute('UPDATE inquilinos SET status = ? WHERE id = ?', [true, id]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async desactivar(id) {
    try {
      const [results] = await connection.execute('UPDATE inquilinos SET status = ? WHERE id = ?', [false, id]);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static async find(id) {
    try {
      const [results] = await connection.execute('SELECT * FROM inquilinos WHERE id = ?', [id]);
      if (results.length === 0) {
        throw new Error('No se encontró ningún inquilino con ese ID');
      }
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  static async findEmail(email) {
    try {
      const [results] = await connection.execute('SELECT * FROM inquilinos WHERE email = ?', [email]);
     // if (results.length === 0) {
       // throw new Error('No se encontró ningún inquilino con ese ID');
     // }
      return results[0];
    } catch (error) {
      throw error;
    }
  }

  static async index(id) {
    try {
      const [results] = await connection.execute('SELECT * FROM inquilinos ');
   
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

module.exports = Inquilino;
