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


function validateCreateRifa(data) {
    const { titulo, precio, pais, numeros, tipo, premios } = data;

    // Validar titulo
    if (titulo) {
        if(!titulo){
            return {mensaje: 'El campo titulo es requerido'};
        }
        if (typeof titulo !== 'string') {
            return { mensaje: 'El título debe ser una cadena de texto' };
        }
        if (titulo.length < 6 || titulo.length > 60) {
            return { mensaje: 'El título debe tener entre 6 y 60 caracteres' };
        }
        
    }

    // Validar precio
    if (precio) {
        if(!precio){
            return {mensaje: 'El campo precio es requerido'};
        }
        if (typeof precio !== 'number') {
            return { mensaje: 'El precio debe ser un número' };
        }
        if (precio < 0) {
            return { mensaje: 'El precio debe ser un número positivo' };
        }
    }

    // Validar pais
    if (pais) {
        if(!pais){
            return {mensaje: 'El campo pais es requerido'};
        }
        if (typeof pais !== 'string') {
            return { mensaje: 'El país debe ser una cadena de texto' };
        }
        if (pais.length < 4 || pais.length > 60) {
            return { mensaje: 'El país debe tener entre 4 y 60 caracteres' };
        }
    }

    // Validar numeros
    if (numeros) {
        if(!numeros){
            return {mensaje: 'El campo numeros es requerido'};
        }
        if (typeof numeros !== 'string') {
            return { mensaje: 'El número debe ser una cadena de texto' };
        }
        if (numeros.length === 0) {
            return { mensaje: 'El número no puede estar vacío' };
        }
    }

    // Validar tipo
    if (tipo) {
        if(!tipo){
            return {mensaje: 'El campo tipo es requerido'};
        }
        if (typeof tipo !== 'string') {
            return { mensaje: 'El tipo debe ser una cadena de texto' };
        }
    }

    // Validar premios
    if (premios) {
        if(!premios){
            return {mensaje: 'El campo premios es requerido'};
        }
        if (!Array.isArray(premios)) {
            return { mensaje: 'Los premios deben ser un arreglo' };
        }
    }

    return null;
};



function assignNumbersValidator(data) {
    const {id_comprador,numbers,method } = data;

    // Validar id comprador
 
    if (id_comprador) {
        if(!id_comprador){
            return {mensaje: 'El id_comprador es requerido'};
        }
        if (typeof id_comprador !== 'number') {
            return { mensaje: 'El id_comprador debe ser un número' };
        }
        if (id_comprador < 0) {
            return { mensaje: 'El id_comprador debe ser un número positivo' };
        }
    }

    
    // Validar premios
    if (numbers) {
        if(!numbers){
            return {mensaje: 'El array de asignaciones es requerido'};
        }
        if (!Array.isArray(numbers)) {
            return { mensaje: 'Los numeros deben ser un arreglo' };
        }
    }
    

    // Validar pais
    if (method) {
        if(!method){
            return {mensaje: 'El campo metodo de pago es requerido'};
        }
        if (typeof method !== 'string') {
            return { mensaje: 'El país debe ser una cadena de texto' };
        }
       
    }


    return null;
}


module.exports = {
    validateUpdateRifa, validateCreateRifa,assignNumbersValidator
};
