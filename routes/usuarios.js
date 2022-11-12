/* 
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { body  } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

/* instancia del Router */
const router = Router();

/* buscar todos */
/* Middleware validarJWT --> como segundo argumento */
/* TODO: como primero se ejecuta el middleware (validarJWT) y después el controlador (getUsuarios),
 entonces en el controlador podemos tener información que haya procesado el middleware, 
 desde el middleware podemos establecer o setear información en la request  que recibirá el controlador*/
router.get('/', validarJWT ,getUsuarios);

/* guardar usuario */
/* Middleware --> como segundo argumento */
router.post('/', 
    [ 
        body('nombre', 'El nombre es obligatorio').not().isEmpty(),
        body('password', 'El password es obligatorio').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ] ,crearUsuarios);


/* actualizar usuario */    
/* Middleware body --> como segundo argumento */    
router.put('/:id', 
    [
        validarJWT,
        body('nombre', 'El nombre es obligatorio').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        body('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos
    ] ,
    actualizarUsuarios
);

/* eliminar usuario */
router.delete('/:id', validarJWT ,borrarUsuario);

module.exports = router;