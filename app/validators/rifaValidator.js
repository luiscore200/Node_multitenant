function validateUpdateRifa(data) {
    const { titulo, precio, pais, numeros, tipo, premios } = data;

    // Validar titulo
    if (titulo) {
        if (typeof titulo !== 'string') {
            return { mensaje: 'El título debe ser una cadena de texto' };
        }
        if (titulo.length < 6 || titulo.length > 60) {
            return { mensaje: 'El título debe tener entre 6 y 60 caracteres' };
        }
    }

    // Validar precio
    if (precio) {
        if (typeof precio !== 'number') {
            return { mensaje: 'El precio debe ser un número' };
        }
        if (precio < 0) {
            return { mensaje: 'El precio debe ser un número positivo' };
        }
    }

    // Validar pais
    if (pais) {
        if (typeof pais !== 'string') {
            return { mensaje: 'El país debe ser una cadena de texto' };
        }
        if (pais.length < 4 || pais.length > 60) {
            return { mensaje: 'El país debe tener entre 4 y 60 caracteres' };
        }
    }

    // Validar numeros
    if (numeros) {
        if (typeof numeros !== 'string') {
            return { mensaje: 'El número debe ser una cadena de texto' };
        }
        if (numeros.length === 0) {
            return { mensaje: 'El número no puede estar vacío' };
        }
    }

    // Validar tipo
    if (tipo) {
        if (typeof tipo !== 'string') {
            return { mensaje: 'El tipo debe ser una cadena de texto' };
        }
    }

    // Validar premios
    if (premios) {
        if (!Array.isArray(premios)) {
            return { mensaje: 'Los premios deben ser un arreglo' };
        }
    }

    return null;
}

module.exports = {
    validateUpdateRifa,
};
