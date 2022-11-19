const { response, request } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req,res = response)=>{
    try {
        /* con el populate -> nos retorna del campo usuario el nombre y el img, de la coleccion hospitales,
        usuario es una coleccion anidada con hospitales */
        const hospitales = await Hospital.find()
                                        .populate('usuario','nombre img');
        res.json({
            ok: true,
            hospitales
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!'
        })
    }
    
}


const crearHospital = async (req,res = response)=>{
    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body//desestructuramos todos los campos que trae el "req.body"
    });
    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!'
        })
    }
}

const actualizarHospital = async (req = request,res = response)=>{
    const id = req.params.id;
    const uid = req.uid;//usuario que está actualizando el hospital

    try {
        const hospitaDB = await Hospital.findById(id);
        if (!hospitaDB) {
            res.status(404).json({
                ok: false,
                msg: 'hospital no encontrado'
            });    
        }

        //hospitaDB.nombre = req.body.nombre;
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        /* el parametro --> {new: true} nos retorna el hospital actualizado */
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true});

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }

    
}


const borrarHospital = async (req = request,res = response)=>{
    const id = req.params.id;
    try {
        const hospitaDB = await Hospital.findById(id);
        if (!hospitaDB) {
            res.status(404).json({
                ok: false,
                msg: 'hospital no encontrado'
            });    
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital eliminado!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}