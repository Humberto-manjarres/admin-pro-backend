const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req, res = response)=> {

    try {
        const {email, name, picture } = await googleVerify(req.body.token);
        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true;
        }
        //guardar usuario
        await usuario.save();

        //generar el token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        }) 
    }
    
}

const renewToken = async (req, res = response)=> {
    
    const uid = req.uid;

    //generar el token
    const token = await generarJWT(uid);

    try {
        //Obtener usuario por uid
        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            res.status(404).json({
            ok: false,
            msg: 'Usuario no existe!'     
            })
        }
        
        res.json({
            ok: true,
            token,
            usuarioDb
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });    
    }
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}