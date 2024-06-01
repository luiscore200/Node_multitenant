const jwt = require('jsonwebtoken');
require('dotenv').config();

class JWT {
    constructor() {
        this.secretKey = process.env.JWT_SECRET;
    }

    generateToken(payload, expiresIn) {
        return jwt.sign(payload, this.secretKey, { expiresIn });
    }

    verifyToken(token) {
      
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null; // Retorna null si la verificación falla
        }
    }
}

module.exports = new JWT(); // Exporta una instancia de la clase JWT
