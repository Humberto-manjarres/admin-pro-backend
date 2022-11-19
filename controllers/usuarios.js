const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req = request,res)=>{

    /* "desde" parametro enviado desde la petición HTTP,
    si no viene el parametro "desde" entonces que tome el valor 0 */
    const desde = +req.query.desde || 0;
    console.log('desde --> ',desde);

    const [usuarios, total] = await Promise.all([
        /* filtro para q solo nos retorne los campos deseados */
        await Usuario.find({},'nombre email role google img')
        .skip(desde)
        .limit(5),
        /* el skip() --> es para q se salte todos los valores que están antes del numero que tiene la variable "desde" */

        await Usuario.count()
    ]);    

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
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
        
        /*  generar TOKEN que será un JWT, y agregamos el id del usuario q se creó */
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