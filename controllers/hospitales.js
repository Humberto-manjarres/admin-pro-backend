const { response } = require('express');
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

const actualizarHospital = async (req,res = response)=>{
    res.json({
        ok: true,
        msg: 'actualizar hospital'
    });
}


const borrarHospital = async (req,res = response)=>{
    res.json({
        ok: true,
        msg: 'borrar hospital'
    });
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}