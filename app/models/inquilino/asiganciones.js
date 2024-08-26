const connection = require('../../database/connection');

class Assignament {
    constructor() {}

    static async store(propietario, id_raffle, number, status, id_purchaser) {
        try {
            const [results] = await connection.execute(
                `INSERT INTO ${propietario}.assignament (id_raffle, number, status, id_purchaser) VALUES (?, ?, ?, ?)`,
                [id_raffle, number, status, id_purchaser]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async eliminar(propietario, id) {
        try {
            const [results] = await connection.execute(
                `DELETE FROM ${propietario}.assignament WHERE id = ?`,
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
                `SELECT * FROM ${propietario}.assignament`
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async findByRaffle(propietario, id_raffle) {
        try {
            const [results] = await connection.execute(
                `SELECT * FROM ${propietario}.assignament WHERE id_raffle = ?`,
                [id_raffle]
            );
            return results;
        } catch (error) {
            throw error;
        }
    } 
    
    static async findById(propietario, id) {
        try {
            const [results] = await connection.execute(
                `SELECT 
                a.id,
                a.number,
                a.status,
                a.id_raffle,
                p.id as purchaser_id,
                p.name as purchaser_name,
                p.email as purchaser_email,
                p.phone as purchaser_phone
                FROM ${propietario}.assignament a
                JOIN ${propietario}.purchaser p ON a.id_purchaser = p.id
                WHERE a.id= ? `,
                [id]
            );
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw error;
        }
    }
    static async findNumberByRaffle(propietario, id_raffle, number) {
        try {
            const [results] = await connection.execute(
                `SELECT 
                a.id,
                a.number,
                a.status,
                p.id as purchaser_id,
                p.name as purchaser_name,
                p.email as purchaser_email,
                p.phone as purchaser_phone
                FROM ${propietario}.assignament a
                JOIN ${propietario}.purchaser p ON a.id_purchaser = p.id
                WHERE a.id_raffle = ? AND a.number = ?`,
                [id_raffle, number]
            );
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw error;
        }
    }


    static async findAllWithPurchasers(propietario, id_raffle) {
        try {
            const [results] = await connection.execute(
                `SELECT 
                    a.id,
                    a.number,
                    a.status,
                    p.id as purchaser_id,
                    p.name as purchaser_name,
                    p.email as purchaser_email,
                    p.phone as purchaser_phone
                 FROM ${propietario}.assignament a
                 JOIN ${propietario}.purchaser p ON a.id_purchaser = p.id
                 WHERE  a.id_raffle = ?`,
                [id_raffle]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }


    

    static async countByRaffle(propietario, id_raffle) {
        try {
            const [results] = await connection.execute(
                `SELECT COUNT(*) as count FROM ${propietario}.assignament WHERE id_raffle = ?`,
               
                [id_raffle]
            );
            return results[0].count;

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

            const sql = `UPDATE ${propietario}.assignament SET ${fields.join(', ')} WHERE id = ?`;

            const [results] = await connection.execute(sql, values);
            return results.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
    static async findSeparatedWithPurchasers(propietario, id_raffle) {
        try {
            const [results] = await connection.execute(
                `SELECT 
                    a.id,
                    a.number,
                    a.status,
                    p.id as purchaser_id,
                    p.name as purchaser_name,
                    p.email as purchaser_email,
                    p.phone as purchaser_phone
                 FROM ${propietario}.assignament a
                 JOIN ${propietario}.purchaser p ON a.id_purchaser = p.id
                 WHERE a.status = 'separado' AND a.id_raffle = ?`,
                [id_raffle]
            );
            return results;
        } catch (error) {
            throw error;
        }
    }

    static async eliminarAntiguasSeparadas(propietario) {
        try {
            // Primero, seleccionamos las filas que serán eliminadas
            const [rowsToDelete] = await connection.execute(
                `SELECT * FROM ${propietario}.assignament WHERE status = 'separado' AND created_at < NOW() - INTERVAL 1 DAY`
            );
    
            if (rowsToDelete.length > 0) {
                // Luego, eliminamos las filas seleccionadas
                await connection.execute(
                    `DELETE FROM ${propietario}.assignament WHERE status = 'separado' AND created_at < NOW() - INTERVAL 1 DAY`
                );
            }
    
            return rowsToDelete; // Retornamos las filas eliminadas
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Assignament;
