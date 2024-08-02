function isValidUser(user) {
    try {
        const users = JSON.parse(user);
        if (Array.isArray(users)) {
            return users.every(element => !isNaN(element));
        }
        return !isNaN(users);
    } catch (e) {
        return !isNaN(user);
    }
}

exports.validateUserAndTokens = (query) => {
    const { user, tokens,id } = query;

    let users;

    if(!id){
        return {mensaje:"El parametro ID es requerido"};
    }else{
        if(isNaN(id)){
            return {mensaje:"Formato de rifa no valido"};
        }
    }
    

    if (user) {
        if (!isValidUser(user)) {
            return { mensaje: "Formato de usuario no válido" };
        }
        try {
            users = JSON.parse(user);
            if (!Array.isArray(users)) {
                users = [Number(users)];
            }
        } catch (e) {
            users = [Number(user)];
        }
        return { users, tokens: Number(tokens) || undefined };  // Retorna objeto con users y tokens
    }

    if (!user) {
        if (tokens) {
            if (isNaN(tokens)) {
                return { mensaje: "No se esperaba recibir este formato para tokens" };
            }
            return { users: undefined, tokens: Number(tokens) };  // Retorna tokens si no hay error
        } else {
            return { mensaje: "Se esperaba recibir el parámetro tokens" };
        }
    }

    return null;
};
