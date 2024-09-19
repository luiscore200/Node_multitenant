function validateUpdateRifa(data) {
    const { titulo, precio, pais, numeros, tipo, premios } = data;

    // Validar titulo
    if (titulo) {
        if (typeof titulo !== 'string') {
            return { error: 'El título debe ser una cadena de texto' };
        }
        if (titulo.length===0) {
           
                return { error: 'El titulo es requerido' };
            
        }
        if (titulo.length>60) {
           
            return { error: 'El titulo es demaciado largo' };
        
    }
        }
    

    // Validar precio
    if (precio) {
        if (isNaN(precio)) {
            return { error: 'El precio debe ser un número' };
        }
        if (precio < 0) {
            return { error: 'El precio debe ser un número positivo' };
        }
    }

    // Validar pais
    if (pais) {
        if (typeof pais !== 'string') {
            return { error: 'El país debe ser una cadena de texto' };
        }
        if (pais.length ===0) {
            return { error: 'El campo pais es requerido' };
        }
    }

    // Validar numeros
    if (numeros) {
        if (typeof numeros !== 'string') {
            return { error: 'El número debe ser una cadena de texto' };
        }
        if (numeros.length === 0) {
            return { error: 'El campo numero es requerido' };
        }
    }

    // Validar tipo
    if (tipo) {
        if (typeof tipo !== 'string') {
            return { error: 'El tipo debe ser una cadena de texto' };
        }
        if (tipo.length === 0) {
            return { error: 'El campo tipo es requerido' };
        }
    }
    

    // Validar premios
    if (premios) {
        if(typeof premios === "string"){ 
            try {
                   const pr= JSON.parse(premios);
                   if(!Array.isArray(pr)){ return {error:'los premios deben ser un arreglo1'};}
                   
            } catch (error) {
                return {error:'premio no es un json compatible'};
            }
          }else{
            if (!Array.isArray(premios)) {return { error: 'Los premios deben ser un arreglo2' };}
          }
       
    }

    return null;
}


function validateCreateRifa(data) {
    const { titulo, precio, pais, numeros, tipo, premios } = data;

    // Validar titulo
    if (titulo) {
        if(!titulo){
            return {error: 'El campo titulo es requerido'};
        }
        if (typeof titulo !== 'string') {
            return { error: 'El título debe ser una cadena de texto' };
        }
        if (titulo.length < 6 || titulo.length > 60) {
            return { error: 'El título debe tener entre 6 y 60 caracteres' };
        }
        
    }

    // Validar precio
    if (precio) {
        if(!precio){
            return {error: 'El campo precio es requerido'};
        }
        if(typeof precio ==="string" && isNaN(precio)){
            return { error: 'El precio debe ser un número' };
        }
        
        if (precio < 0) {
            return { error: 'El precio debe ser un número positivo' };
        }
    }

    // Validar pais
    if (pais) {
        if(!pais){
            return {error: 'El campo pais es requerido'};
        }
        if (typeof pais !== 'string') {
            return { error: 'El país debe ser una cadena de texto' };
        }
        if (pais.length < 4 || pais.length > 60) {
            return { error: 'El país debe tener entre 4 y 60 caracteres' };
        }
    }

    // Validar numeros
    if (numeros) {
        if(!numeros){
            return {error: 'El campo numeros es requerido'};
        }
        if (typeof numeros !== 'string') {
            return { error: 'El número debe ser una cadena de texto' };
        }
        if (numeros.length === 0) {
            return { error: 'El número no puede estar vacío' };
        }
    }

    // Validar tipo
    if (tipo) {
        if(!tipo){
            return {error: 'El campo tipo es requerido'};
        }
        if (typeof tipo !== 'string') {
            return { error: 'El tipo debe ser una cadena de texto' };
        }
    }

    // Validar premios
    if (premios) {
            if(!premios){
                return {error: 'El campo premios es requerido'};
            }
       
            if(typeof premios === "string"){ 
                try {
                       const pr= JSON.parse(premios);
                       if(!Array.isArray(pr)){ return {error:'los premios deben ser un arreglo'};}
                       
                } catch (error) {
                    return {error:'premio no es un json compatible'};
                }
              }else{
                if (!Array.isArray(premios)) {return { error: 'Los premios deben ser un arreglo' };}
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
    
 /*
    // Validar pais
    if (method) {
        if(!method){
            return {mensaje: 'El campo metodo de pago es requerido'};
        }
        if (typeof method !== 'string') {
            return { mensaje: 'El país debe ser una cadena de texto' };
        }
       
    }*/


    return null;
}


module.exports = {
    validateUpdateRifa, validateCreateRifa,assignNumbersValidator
};
