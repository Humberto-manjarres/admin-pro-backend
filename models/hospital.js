const {Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        require: true
    },
    img:{
        type: String
    },
    /* usuario q creó el hospital,
     'Schema.Types.ObjectId' indica que hay una relación de este esquema, con el esquema de usuario. */
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
    /* '{collection: 'hospitales'}' --> nombre que tendrá la colección en BD */
},{collection: 'hospitales'});

/* esto es para cambiar de _id a uid */
HospitalSchema.method('toJSON', function() {
    const {__v,...object} = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);