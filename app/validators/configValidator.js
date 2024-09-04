exports.validateConfigUpdate = (data) => {
    const {
      phone_verified,
      phone_status,
      email,
      password_email,
      email_status,
      email_verified,
      logo,
      bussines_name,
    } = data;
  
   
  
    // Validate phone_verified (optional but must be 0 or 1 if provided)
    if (phone_verified !== null) {
      if (typeof phone_verified !== "boolean") {
      return {
        
         error: 'El valor de phone_verified debe ser un booleano',
        }
      }
    }
  
    // Validate phone_status (optional but must be 0 or 1 if provided)
    if (phone_status !== null) {
      if (typeof phone_status !== "boolean") {
        return {
       
         error: 'El valor de phone_status debe ser un booleano',
        }
      }
    }
  
    // Validate email (optional but must be in valid email format if provided)
    if (email !== null) {
      if (email && !validateEmail(email)) {
        return {
        
         error: 'Formato de correo electrónico inválido',
        }
      }
    }
  
    // Validate password_email (optional but must be a string if provided)
    if (password_email !== null) {
      if (typeof password_email !== 'string') {
        return {
       
         error: 'El valor de password_email debe ser una cadena de texto',
        }
      }
    }
  
    // Validate email_status (optional but must be 0 or 1 if provided)
    if (email_status !== null) {
      if (typeof email_status === "boolean") {
        return {
         
         error: 'El valor de email_status debe ser un booleano',
        }
      }
    }
  
    // Validate email_verified (optional but must be 0 or 1 if provided)
    if (email_verified !== null) {
      if (typeof email_verified === "boolean") {
     
        return {
         error: 'El valor de email_verified debe ser un booleano',
        }
      }
    }
  
    // Validate logo (optional but must be a string if provided)
    /*
    if (logo !== null) {
      if (typeof logo !== 'string') {
      
        return {
         mensaje: 'El valor de logo debe ser una cadena de texto',
        }
      }
    }
  
    // Validate bussines_name (optional but must be a string if provided)
    if (bussines_name !== null) {
      if (typeof bussines_name !== 'string') {
        return {
         mensaje: 'El valor de bussines_name debe ser una cadena de texto',
        }
      }
    }*/
  
    // Return validation errors or null if no errors

    return null;
  
  };
  
  // Function to validate an email
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }