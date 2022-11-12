const { response } = require('express');
const { validationResult  } = require('express-validator');

const validarCampos = (req, res = response, next)=> {
     /* Si existen errores en el Middleware de validación en el body, en este punto ya tenemos todos los errores, es decir el resultado de la validación */
     const errors = validationResult(req);//arreglo de errores generados.
     if (!errors.isEmpty()) {
        return res.status(400).json({
              errors: errors.array() 
        });
     }
     next();
}

module.exports = {
    validarCampos
}