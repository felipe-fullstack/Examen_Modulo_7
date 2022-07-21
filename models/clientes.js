const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clienteSchema = new Schema(
    {
        nombre: String,
        apellido: String,
        rut: String,
        telefono: String
    }
);

//SUPUESTO 'Cliente' la bd se supone clientes en pluralismo ATENCIÓN A ESTO!!!!
const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;