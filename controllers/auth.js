const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response)=> {
    const { email, password } = req.body;
    try {

        /* verificando email */
        const usuarioDb = await Usuario.findOne({email});

        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado!'
            })
        }

        /* verificando y comparando contraseñas */
        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida!'
            });
        }

        /*  generar TOKEN que será un JWT */
        const token = await generarJWT(usuarioDb.id);
            
        res.json({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!'
        })
    }
}

module.exports = {
    login
}