const fs = require('fs');
const path = require('path');
const  {makeWASocket,DisconnectReason,fetchLatestBaileysVersion, useMultiFileAuthState}= require('@whiskeysockets/baileys');
const dns = require('dns');
const config = require('../models/inquilino/config');
const notification = require('../models/inquilino/notificaciones');



class WhatsAppService {
    // Usamos un Map para almacenar las sesiones, con el userId como clave
    static sessions = new Map();

    // Método para obtener o crear una nueva sesión
    static async getSession(userId) {
        if (this.sessions.has(userId)) {
            // Si la sesión ya existe, devolver la sesión activa
            return this.sessions.get(userId);
        } else {
            // Si no existe, crear una nueva sesión
            const session = await this.createSession(userId);
            this.sessions.set(userId, session);  // Almacenar la nueva sesión
            return session;
        }
    }

    // Método para crear una nueva sesión
    static async createSession(userId) {
        const { state, saveCreds } = await useMultiFileAuthState(getSessionPath(userId));
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({
            version,
            logger: console,  // Puedes ajustar el logger según sea necesario
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            fireInitQueries: false,
            shouldSyncHistoryMessage: (msg) => false,
            emitOwnEvents: false,
            maxMsgRetryCount: 10000,
            keepAliveIntervalMs: 20000,
            connectTimeoutMs: 10000
        });

        return new Promise((resolve, reject) => {
            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;
                if (update.qr) {
                    // Si se recibe un QR, resolver con el QR para la autenticación
                    resolve(update.qr);
                } else if (connection === 'open') {
                    // Si la conexión está abierta, guardar la sesión y resolver
                    sock.ev.on('creds.update', saveCreds);
                    resolve(sock);
                } else if (connection === 'close') {
                    // Si la conexión se cierra, manejar según el estado de la desconexión
                    if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
                        clearSession(userId);
                        reject('Sesión cerrada: El usuario se ha desconectado');
                    } else {
                        reject('Conexión cerrada');
                    }
                }
            });
        });
    }

    // Método para cerrar una sesión
    static async closeSession(userId) {
        if (this.sessions.has(userId)) {
            const session = this.sessions.get(userId);
            session.end();  // Cierra la sesión de WhatsApp
            this.sessions.delete(userId);  // Elimina la sesión del Map
        }
    }
}

export default WhatsAppService;
