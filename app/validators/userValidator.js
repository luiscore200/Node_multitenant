exports.validateCreateUser = (data) => {
    const { name, email, password, phone, status, role,country, domain } = data;

    if (!name) {
        return { mensaje: 'Nombre requerido' };
    }


    if (typeof name !== 'string') {
        return { mensaje: 'El nombre debe ser una cadena de texto' };
    }
    

    if (name.length < 6 || name.length > 60) {
        return { mensaje: 'El nombre debe tener entre 6 y 60 caracteres' };
    }

    if (!email) {
        return { mensaje: 'Correo electrónico requerido' };
    }

    if (typeof email !== 'string') {
        return { mensaje: 'El correo electrónico debe ser una cadena de texto' };
    }

    if (!domain) {
        return { mensaje: 'Dominio requerido' };
    }
    if (typeof domain !== 'string') {
        return { mensaje: 'El dominio debe ser una cadena de texto' };
    }
    if (domain.length < 6 || name.length > 60) {
        return { mensaje: 'El dominio debe tener entre 6 y 60 caracteres' };
    }

    if (!phone) {
        return { mensaje: 'Telefono requerido' };
    }
    if (typeof phone !== 'string') {
        return { mensaje: 'El telefono debe ser una cadena de texto' };
    }
    if (phone.length < 8 || phone.length > 15) {
        return { mensaje: 'El telefono debe tener entre 8 y 15 caracteres' };
    }

    if (!country) {
        return { mensaje: 'country requerido' };
    }
    if (typeof country !== 'string') {
        return { mensaje: 'El country debe ser una cadena de texto' };
    }
    if (country.length < 4 || name.length > 60) {
        return { mensaje: 'El country debe tener entre 6 y 60 caracteres' };
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

    if (role !== undefined && typeof role !== 'string') {
        return { mensaje: 'El rol debe ser una cadena de texto' };
    }

    if (role && !validateRole(role)) {
        return { mensaje: 'El rol debe ser "user" o "admin"' };
    }

    return null;
};

////////////////////////////////////////////////////

exports.validateUpdateUser = (data) => {
    const { name, email, password, status,phone, role,domain, country,payed } = data;

    if (name && typeof name !== 'string') {
        return { mensaje: 'El nombre debe ser una cadena de texto' };
    }

    if (name && (name.length < 6 || name.length > 60)) {
        return { mensaje: 'El nombre debe tener entre 6 y 60 caracteres' };
    }

    if (email && typeof email !== 'string') {
        return { mensaje: 'El correo electrónico debe ser una cadena de texto' };
    }

    if (email && !validateEmail(email)) {
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

    if (role !== undefined && typeof role !== 'string') {
        return { mensaje: 'El rol debe ser una cadena de texto' };
    }

    if (role && !validateRole(role)) {
        return { mensaje: 'El rol debe ser "user" o "admin"' };
    }
    if (typeof phone !== 'string') {
        return { mensaje: 'El telefono debe ser una cadena de texto' };
    }
    if (phone.length < 8 || name.length > 15) {
        return { mensaje: 'El telefono debe tener entre 8 y 15 caracteres' };
    }
    

    if ( typeof domain !== 'string') {
        return { mensaje: 'El dominio debe ser una cadena de texto' };
    }
    if (domain.length < 6 || name.length > 60) {
        return { mensaje: 'El dominio debe tener entre 6 y 60 caracteres' };
    }

 
    if (typeof country !== 'string') {
        return { mensaje: 'El country debe ser una cadena de texto' };
    }
    if (country.length < 4 || name.length > 60) {
        return { mensaje: 'El country debe tener entre 6 y 60 caracteres' };
    }
    
    if (typeof payed !== 'boolean') {
        return { mensaje: 'El campo payed debe ser un booleano' };
    }

    return null;
};



///////////////////////////////////////////////////






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