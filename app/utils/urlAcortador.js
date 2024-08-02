// services/shortenUrlService.js
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'shortedTokens.db');

// Importar `nanoid` de forma dinámica
let nanoid;
(async () => {
    const module = await import('nanoid');
    nanoid = module.nanoid;
    await createTable(); // Crear tabla una vez que nanoid esté disponible
})();

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
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            createdAt INTEGER DEFAULT (strftime('%s','now') * 1000)
        )
    `);
    await db.close();
};

// Crear la tabla al iniciar la aplicación
createTable().catch(console.error);

exports.insertToken = async (url) => {
    if (!nanoid) return; // Esperar a que nanoid esté disponible
    const db = await openDb();
    const shortId = nanoid(20);
    await db.run('INSERT INTO urls (url, token) VALUES (?, ?)', [url, shortId]);
    await db.close();
    return shortId;
};

exports.findUrl = async (token) => {
    const db = await openDb();
    const row = await db.get('SELECT * FROM urls WHERE token = ?', [token]);
    await db.close();
    return row || null;
};

exports.cleanOldUrls = async () => {
    const unDia = 60 * 60 * 24 * 1000; // Milisegundos en un día
    const ahora = Date.now();
    const db = await openDb();
    await db.run('DELETE FROM urls WHERE createdAt < ?', [new Date(ahora - unDia).getTime()]);
    await db.close();
};
