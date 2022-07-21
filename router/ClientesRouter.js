const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Cliente = require('../models/clientes');

router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async (request, response) => {
    try {
        const arrayClientesDBM = await Cliente.find();
        console.log(arrayClientesDBM);

        response.render("clientes", {
            arrayClientes: arrayClientesDBM
        })

    } catch (error) {
        console.log(error);
    }
})

// Código para crear cliente (agregar)
router.post('/agregarCliente', async (request, response) => {
    console.log("********** agregarCliente ************");
    const parametros = request.body;

    try {
        const clienteBD = new Cliente(parametros);
        await clienteBD.save();

        response.redirect('/clientes');

    } catch (error) {
        console.log(error);
    }
})

// Código para dirigir la acción a la página Crear (Clientes)
router.get('/crear', (request, response) => {
    response.render('crear');
})

// Código para Eliminar Cliente ocupando el método DELETE {verbo HTTP}
router.delete('/:id', async (request, response) => {

    console.log("**** borrado del cliente ****");
    const id = request.params.id;
    console.log("ID", id);

    //eliminar de mongoDB al cliente
    // mandar la acción a la vista clientes
    try {
        const clienteDB = await Cliente.findByIdAndDelete(
            id, { userFindAndModify: false }
        )
        response.redirect('/clientes');
    } catch (error) {
        console.log(error);
    }
})

// Código para ver el cliente y posteriormente modificarlo
router.get('/verCliente/:id', async (request, response) => {
    console.log("***ver Cliente***");
    const id = request.params.id;
    console.log("id", id);

    //llamamos al metodoFinOne que nos devuelve el objeto por su ID
    const ClienteBD = await Cliente.findOne({ _id: id })

    //aquí retornamos por consola su nombre y apellido del objeto
    console.log("clienteBD nombre", ClienteBD.nombre);
    console.log("clienteBD apellido", ClienteBD.apellido);

    //aqui tomamos el archivo editarCliente (nuestra vista al usuario) y le pasamos un objeto en este caso nombre y apellido
    response.render("editarCliente", {
        nombre: ClienteBD.nombre,
        apellido: ClienteBD.apellido,
        rut: ClienteBD.rut,
        telefono: ClienteBD.telefono,
        id: id
    });
})

// Código para Editar Cliente
router.post("/verCliente/editarCliente", async (request, response) => {
    console.log("**** Editar Cliente ****");
    const body = request.body;
    const id = request.body.id;
    console.log(body);

    try {
        const clienteDB = await Cliente.findByIdAndUpdate(
            id, body, { userFindAndModify: false }
        )
        response.redirect('/clientes');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;

