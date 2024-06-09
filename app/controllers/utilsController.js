const connection = require('../database/connection');

exports.indexPhone = async (req, res) => {
    try {
        // Consulta para seleccionar todos los datos de la tabla `phone_codes`
        const [rows, fields] = await connection.execute('SELECT * FROM phone_codes');

        // Enviar los datos como respuesta
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

