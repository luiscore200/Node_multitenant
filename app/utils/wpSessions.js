const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'WPsessions.db');

const openDb = async () => {
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
};

const createTable = async () => {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dominio TEXT UNIQUE NOT NULL,
            auth TEXT NULL
        )
    `);
    await db.close();
};

// Crear la tabla al iniciar la aplicación
createTable().catch(console.error);

exports.insert = async (dominio, auth) => {
    const db = await openDb();
    await db.run('INSERT INTO sessions (dominio, auth) VALUES (?, ?)', [dominio, auth]);
    await db.close();
    
};

exports.find = async (dominio) => {
    const db = await openDb();
    const row = await db.get('SELECT * FROM sessions WHERE dominio = ?', [dominio]);
    await db.close();
    return row || null;
};

exports.destroy = async (dominio) => {
    const db = await openDb();
    await db.run('DELETE FROM sessions WHERE dominio = ?', [dominio]);
    await db.close();
};

exports.update = async (dominio, auth) => {
    const db = await openDb();
    
    // Consulta SQL corregida para actualizar la sesión
    await db.run('UPDATE sessions SET auth = ? WHERE dominio = ?', [auth, dominio]);
    
    await db.close();
    return auth; // Devolviendo auth para confirmar que se actualizó
};

exports.saveAuth = async (dominio, auth) => {
    const db = await openDb();
    await db.run(`
        INSERT INTO sessions (dominio, auth)
        VALUES (?, ?)
        ON CONFLICT(dominio) 
        DO UPDATE SET auth = excluded.auth
    `, [dominio, auth]);
    await db.close();
};

// Función para cargar el estado de autenticación
exports.loadAuth = async (dominio) => {
    const db = await openDb();
    const row = await db.get('SELECT auth FROM sessions WHERE dominio = ?', [dominio]);
    await db.close();
    return row ? row.auth : null;
};