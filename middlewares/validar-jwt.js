const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res = response , next) => {
    
    /* leer el Token */    
    const tokenHeader = req.header('x-token');
    if (!tokenHeader) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay Token en la petición'
        })
    }

    try {
        /* comparando Token */
        const { uid } = jwt.verify(tokenHeader, process.env.JWT_SECRET);
        
        /* seteando información en la request, es decir, la request tendrá un nuevo elemento llamado uid */
        req.uid = uid;

        next();    
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es valido!'
        })
    }

}

const validarADMIN_ROLE = async (req, res, next)=>{
    const uid = req.uid
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            })
        }
        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios'
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con el administrador'
        })
    }
}

const validarADMIN_ROLE_0_MismoUsuario = async (req, res, next)=>{
    const uid = req.uid
    console.log(uid);
    const id = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        console.log(usuarioDB);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            })
        }
        if (usuarioDB.role === 'ADMIN_ROLE' && uid === id) {
            next();   
        }else{
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con el administrador'
        })
    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_0_MismoUsuario
}