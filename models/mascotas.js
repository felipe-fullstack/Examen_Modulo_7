const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mascotaSchema = new Schema(
    {
        nombre: String,
        raza: String,
        ano: String,
        descripcion: String
    }
);

//SUPUESTO 'mascota' la bd se supone mascota en pluralismo ATENCIÓN A ESTO!!!!
const Mascota = mongoose.model('mascota', mascotaSchema);

module.exports = Mascota;