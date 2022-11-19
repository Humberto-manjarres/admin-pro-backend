/* fs --> fileSystem, paquete de NODE que nos ayuda a leer las carpeta y archivos */
const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const borrarImagen = (path)=> {
            
    /* si existe una imagen en esa ruta --> pathViejo */
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);//borrar imagen anterior
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo)=> {
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('medico no existe!');
                return false;
            }
            
            const pathViejoMedico = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejoMedico);
            
            medico.img = nombreArchivo;
            medico.save();
            return true;
            
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('hospital no existe!');
                return false;
            }
            
            const pathViejoHospital = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejoHospital);
            
            hospital.img = nombreArchivo;
            hospital.save();
            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('usuario no existe!');
                return false;
            }
            
            const pathViejoUsuario = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejoUsuario);
            
            usuario.img = nombreArchivo;
            usuario.save();
            return true;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'No es un medico - usuario - hospital (tipo)'
            })
    }
}

module.exports = {
    actualizarImagen
}