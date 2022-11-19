const {Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    img:{
        type: String
    },
    /* usuario q creó el médico,
     'Schema.Types.ObjectId' indica que hay una relación de este esquema, con el esquema de médico. */
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    /* a que hospital pertenece el médico */
    hospital: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
    /* '{collection: 'medicos'}' --> nombre que tendrá la colección en BD */
},{collection: 'medicos'});

/* esto es para cambiar de _id a uid */
MedicoSchema.method('toJSON', function() {
    const {__v,...object} = this.toObject();
    return object;
})

module.exports = model('Medico', MedicoSchema);