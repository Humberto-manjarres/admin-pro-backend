/* 
    Ruta: /api/hospitales
*/
const { Router } = require('express');
const { body  } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales')

/* instancia del Router */
const router = Router();

router.get('/',getHospitales);



router.post('/', 
    [ 
        validarJWT,
        body('nombre', 'El nombre de hospital es obligatorio').not().isEmpty(),
        validarCampos 
    ] ,
    crearHospital);

router.put('/:id', 
    [
        validarJWT,
        body('nombre', 'El nombre de hospital es obligatorio').not().isEmpty(),
        validarCampos
    ] ,
    actualizarHospital
);

router.delete('/:id',validarJWT,borrarHospital);

module.exports = router;