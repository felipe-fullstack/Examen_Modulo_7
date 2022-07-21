const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Mascota = require('../models/mascotas');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (request, response) => {
    try {
        const arrayMascotasDBM = await Mascota.find();
        //  console.log(arrayMascotasDBM);

        response.render("mascotas", {
            arrayMascotas: arrayMascotasDBM
        })

    } catch (error) {
        console.log(error);
    }
})

// Código para crear mascotas (agregar)
router.post('/agregarMascota', async (request, response) => {
    console.log("********** agregarMascota ************");
    const parametros = request.body;

    try {
        const mascotaBD = new Mascota(parametros);
        await mascotaBD.save();

        response.redirect('/mascotas');

    } catch (error) {
        console.log(error);
    }
})

// Código para dirigir la acción a la página Crear (Mascotas)
router.get('/crearMascotas', (request, response) => {
    response.render('crearMascotas');
})

//Método para Eliminar la Mascota ocupando el método DELETE {verbo HTTP}
router.delete('/:id', async (request, response) => {

    console.log("**** borrado de la mascota ****");
    const id = request.params.id;
    console.log("ID: ", id);
    try {
        await Mascota.findByIdAndDelete(id, { userFindAndModify: false } //eliminar de mongoDB una mascota por su id
        )
        response.redirect('/mascotas');  // mandar la acción a la vista mascota
    } catch (error) {
        console.log(error);
    }
})

// Código para ver la mascota y posteriormente modificarlo
router.get('/verMascota/:id', async (request, response) => {
    console.log("***ver Mascota***");
    const id = request.params.id;
    console.log("id", id);

    //llamamos al metodoFinOne que nos devuelve el objeto por su ID
    const MascotaBD = await Mascota.findOne({ _id: id })

    //aquí retornamos por consola su nombre, raza, año de nacimiento y descripcion del objeto mascota
    console.log("mascotaBD nombre", MascotaBD.nombre);
    console.log("mascotaBD raza", MascotaBD.raza);
    console.log("mascotaBD año de nacimiento", MascotaBD.ano);
    console.log("mascotaBD descripcion", MascotaBD.descripcion);

    //aqui tomamos el archivo editarMascota (nuestra vista al usuario) y le pasamos un objeto mascota en este caso nombre, raza, año de nacimiento y descripcion
    response.render("editarMascota", {
        nombre: MascotaBD.nombre,
        raza: MascotaBD.raza,
        ano: MascotaBD.ano,
        descripcion: MascotaBD.descripcion,
        id: id
    });
})

//codigo para Editar Mascota
router.post("/verMascota/editarMascota/", async (request, response) => {
    console.log("**** Editar Mascota ****");
    const body = request.body;
    const id = request.body.id;
    /* const nombre = request.body.nombre;
     const raza = request.body.raza;
     const ano = request.body.ano;
     const descripcion = request.body.descripcion*/

    //console.log(body);

    try {
        const clienteDB = await Mascota.findByIdAndUpdate(
            id, body, { userFindAndModify: false }
        )
        response.redirect('/mascotas');  // mandar la acción a la vista mascota
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;