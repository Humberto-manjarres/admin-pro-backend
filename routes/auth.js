/* 
    Path: '/api/login'
*/
const { Router } = require('express');
const { body  } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

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

router.get('/renew', 
    validarJWT,
    renewToken
);


module.exports = router;