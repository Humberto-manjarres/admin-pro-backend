/* 
    Path: '/api/login'
*/
const { Router } = require('express');
const { body  } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

/* instancia del router */
const router = Router();


router.post('/', 
    [
        body('password', 'El password es obligatorio').not().isEmpty(),
        body('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    login
);


module.exports = router;