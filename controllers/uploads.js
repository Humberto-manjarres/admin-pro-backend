/* este path es un paquete propio de NODE, nos ayuda a construir un path de ruta completo */
const path = require('path');

/* fs --> fileSystem, paquete de NODE que nos ayuda a leer las carpeta y archivos */
const fs = require('fs');

const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req = request,res = response)=> {
    const tipo = req.params.tipo;
    const id = req.params.id;

    //validar tipo
    const tipoValidos = ['hospitales','medicos','usuarios'];
    if (!tipoValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico - usuario - hospital (tipo)'
        })
    }

    /* validar que exista un archivo para subir */
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        })
    }

    //procesar la imagen...
    const file = req.files.imagen;

    /* dividimos el nombre y la extención de la imagen en una arreglo*/
    const nombreCortado = file.name.split('.')

    /* extención del archivo */
    const extencionArchivo = nombreCortado[nombreCortado.length -1];

    /* Validar extención */
    const extencionesValidas = ['png','jpg','jpge','gif'];
    if (!extencionesValidas.includes(extencionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extención permitida'
        })
    }

    // Generar nombre del Archivo
    const nombreArchivo = `${uuidv4()}.${extencionArchivo}`;

    // crear Path dondese guarda la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen 
    file.mv(path, (err)=> {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    });

    
}

const retornaImagen = (req = request,res = response)=> {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-imagen.jpg`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}