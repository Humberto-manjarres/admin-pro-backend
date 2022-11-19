const { response, request } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req ,res = response)=>{
    try {
        const medicos = await Medico.find()
                                    .populate('usuario', 'nombre')
                                    .populate('hospital', 'nombre');
        res.json({
            ok: true,
            medicos
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!'
        })
    }
    
}


const crearMedico = async (req,res = response)=>{
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body//desestructurando todo los campos que trae en "req.body"
    })
    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!'
        })
    }

}

const actualizarMedico = async (req,res = response)=>{
    res.json({
        ok: true,
        msg: 'actualizar medico'
    });
}


const borrarMedico = async (req,res = response)=>{
    res.json({
        ok: true,
        msg: 'borrar medico'
    });
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}