// authValidator.js

exports.validateLogin = (data) => {
    const { email, password } = data;

    // Verificar si el correo electrónico y la contraseña están presentes y son de tipo string
    if (!email) {
        return { mensaje: 'Correo electrónico requerido' };
    }

    if (!password) {
        return { mensaje: 'contraseña requerida' };
    }

    if (typeof email !== 'string') {
        return { mensaje: 'El correo electrónico debe ser una cadena de texto' };
    }

    if (typeof password !== 'string') {
        return { mensaje: 'La contraseña debe ser una cadena de texto' };
    }

    // Validar el formato del correo electrónico
    if (!validateEmail(email)) {
        return { mensaje: 'Formato de correo electrónico inválido' };
    }

    // Validar la contraseña
    if (!validatePassword(password)) {
        return { mensaje: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Si pasa todas las validaciones, retornar null para indicar que el login es válido
    return null;
};

// Función para validar un correo electrónico
function validateEmail(email) {
    // Utilizamos una expresión regular para validar el formato del correo electrónico
    // Esta expresión regular valida un formato de correo electrónico estándar
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar una contraseña
function validatePassword(password) {
    // Verificar si la longitud de la contraseña es mayor o igual a 6 caracteres
    return password.length >= 6;
}
