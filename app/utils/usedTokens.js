// utils/usedTokensDb.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

// Ruta del archivo de la base de datos
const dbPath = path.join(__dirname, 'usedTokens.db');

// Función para abrir la conexión con la base de datos
const openDb = async () => {
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    });
};

// Función para crear la tabla si no existe
const createTable = async () => {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS used_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT UNIQUE NOT NULL,
            createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
        )
    `);
    await db.close();
};

// Crear la tabla al iniciar la aplicación
createTable().catch(console.error);

// Insertar un token en la base de datos
exports.insertToken = async (token) => {
    const db = await openDb();
    await db.run('INSERT INTO used_tokens (token) VALUES (?)', [token]);
    await db.close();
    limpiarTokensAntiguos();
};

// Limpiar los tokens antiguos
const limpiarTokensAntiguos = async () => {
    const unDia = 60 * 60 * 24 * 1000; // Milisegundos en un día
    const ahora = Date.now();
    const db = await openDb();
    await db.run('DELETE FROM used_tokens WHERE createdAt < ?', [new Date(ahora - unDia).getTime()]);
    await db.close();
};

// Obtener todos los tokens usados
exports.getTokens = async () => {
    await limpiarTokensAntiguos();
    const db = await openDb();
    const tokens = await db.all('SELECT token FROM used_tokens');
    await db.close();
    return tokens;
};
