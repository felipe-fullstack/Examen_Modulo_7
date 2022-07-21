const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        email: {
            type: String,
            required: true,
            min: 6,
            max: 1024
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        date: {
            type: Date,
            default: Date.now
        },
    }
);

//SUPUESTO 'usuario' la bd se supone usuario en pluralismo ATENCIÓN A ESTO!!!!
const Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;