const { response, request } = require('express');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

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

const actualizarMedico = async (req = request,res = response)=>{
    const id = req.params.id;
    const idHospital = req.body.hospital;
    const uid = req.uid;//usuario que está actualizando al medico
    try {
        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'medico no encontrado'
            });    
        }

        const hospitaDB = await Hospital.findById(idHospital);
        if (!hospitaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'hospital no existe!'
            });    
        }


        //medicoDB.nombre = req.body.nombre;
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        /* el parametro --> {new: true} nos retorna el hospital actualizado */
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admin'
        });
    }
}


const borrarMedico = async (req,res = response)=>{

    const id = req.params.id;
    try {
        const medicoDB = await Medico.findById(id);
        if (!medicoDB) {
            res.status(404).json({
                ok: false,
                msg: 'medico no encontrado'
            });    
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'medico eliminado!'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}