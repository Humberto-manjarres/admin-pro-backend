/* 
    Medicos
    ruta:  '/api/medicos' 
*/

const { Router } = require('express');
const { body  } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos')

/* instancia del Router */
const router = Router();

router.get('/',getMedicos);



router.post('/', 
    [ 
        validarJWT,
        body('nombre', 'El nombre del medico es obligatorio').not().isEmpty(),
        body('hospital', 'El id del hospital debe ser válido!').isMongoId(),
        validarCampos 
    ],
    crearMedico);

router.put('/:id', 
    [   
        validarJWT,
        body('nombre', 'El nombre del medico es obligatorio').not().isEmpty(),
        body('hospital', 'El id del hospital debe ser válido!').isMongoId(),
        validarCampos
    ],
    actualizarMedico
);

router.delete('/:id',validarJWT,borrarMedico);

module.exports = router;