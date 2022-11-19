/* 
    Path: '/api/login'
*/
const { Router } = require('express');
const { body  } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
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

router.post('/google', 
    [
        body('token', 'El token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);


module.exports = router;