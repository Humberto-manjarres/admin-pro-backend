const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req,res)=>{
    /* filtro para q solo nos retorne los campos deseados */
    const usuarios = await Usuario.find({},'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuarios = async (req,res = response )=>{
    const { email, password} = req.body;
    
    try {
        /* await --> esperamos q esta linea se procese antes de continuar con la siguiente linea */
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'email ya existe!'
            })
        }
        
        const usuario = new Usuario(req.body);
        
        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        
        /*  generar TOKEN que será un JWT */
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok: true,
            usuario,
            token
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado! revisar logs'
        })
    }
}

const actualizarUsuarios = async (req,res = response) =>{
    //TODO: Validar Token y comprobar si es el usuario correcto
   
    const uid = req.params.id;
    
    try {
        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            res.status(404).json({
               ok: false,
               msg: 'Usuario no existe!'     
            })
        }
        
        /* (...campos) extraemos todos los campos enviados desde el formulario,
        extraemos el password y google del ...campos, TODO: hay que poner (...campos) en la ultima posición.
        al extraer el password y el email por aparte, lo que hacemos es cortarlos de los ...campos, es decir,  no estarán juntos con los campos, 
        a menos que se los vuelva asignar a los campos las extracciones */
        const {password, google, email,...campos} = req.body;

        if (usuarioDb.email != email) {
            /* que no exista otro usuario con ese email */
            const existeEmail = await Usuario.findOne({email});
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'ya existe un usuario con ese email'
                })
            }
        }

        /* asignando nuevamente valor a email de campos */
        campos.email = email;

        /* eliminamos los campos que no queremos actualizar */
        /* delete campos.password;
        delete campos.google; */

        /* buscamos el usuario y los actualizamos a la vez.
           con este parametr --> {new: true} nos retorna el usuario actualizado  */
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos , {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
           ok: false,
           msg: 'Error inesperado!'     
        });
    }
}

const borrarUsuario = async (req,res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            res.status(404).json({
               ok: false,
               msg: 'Usuario no existe!'     
            })
        }
        await Usuario.findByIdAndDelete(uid);
        res.status(200).json({
            ok: true,
            msg: 'usuario eliminado'        
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuario
}