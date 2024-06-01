exports.validateCreateUser = (data) => {
    const { nombre, email, password, status, rol } = data;

    if (!nombre) {
        return { mensaje: 'Nombre requerido' };
    }

    if (typeof nombre !== 'string') {
        return { mensaje: 'El nombre debe ser una cadena de texto' };
    }

    if (nombre.length < 6 || nombre.length > 60) {
        return { mensaje: 'El nombre debe tener entre 6 y 60 caracteres' };
    }

    if (!email) {
        return { mensaje: 'Correo electrónico requerido' };
    }

    if (typeof email !== 'string') {
        return { mensaje: 'El correo electrónico debe ser una cadena de texto' };
    }

    if (!validateEmail(email)) {
        return { mensaje: 'Formato de correo electrónico inválido' };
    }

    if (password && typeof password !== 'string') {
        return { mensaje: 'La contraseña debe ser una cadena de texto si se proporciona' };
    }

    if (password && !validatePassword(password)) {
        return { mensaje: 'La contraseña debe tener entre 6 y 60 caracteres' };
    }

    if (status !== undefined && typeof status !== 'boolean') {
        return { mensaje: 'El estado debe ser un valor booleano' };
    }

    if (rol !== undefined && typeof rol !== 'string') {
        return { mensaje: 'El rol debe ser una cadena de texto' };
    }

    if (rol && !validateRole(rol)) {
        return { mensaje: 'El rol debe ser "user" o "admin"' };
    }

    return null;
};

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6 && password.length <= 60;
}

function validateRole(rol) {
    const validRoles = ['user', 'admin'];
    return validRoles.includes(rol);
}