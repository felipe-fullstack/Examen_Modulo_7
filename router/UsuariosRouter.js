const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

// Parsear y Capturar datos del body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Scheme para Registrar Usuario
const schemeRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

//listamos nuestros usuarios a la página desde un array y renderisamos
router.get('/', async (request, response) => {
    try {
        const arrayUsuariosDBM = await Usuario.find();

        response.render("usuarios", {
            arrayUsuarios: arrayUsuariosDBM
        })

    } catch (error) {
        console.log(error);
    }
})

// Código para crear Usuario (agregar)
router.post('/register', async (request, response) => {
    console.log("Entramos a registrarrrrrrrrrrrrrrrrrrrrrrrrr")
    // Validación de la data que nos llega por el request

    const { error } = schemeRegister.validate(request.body);

    if (error) {
        //return response.status(400).json({error: error.details[0].message})
        return response.render('404', { mensaje: error.details[0].message })
    }

    // Verifico si existe un usuario con un email determinado
    const isEmailExist = await Usuario.findOne({ email: request.body.email });
    if (isEmailExist) {
        //return response.status(400).json({ error: 'Email ya registrado' });
        return response.render('404', { mensaje: 'El email ya está registrado. Intente nuevamente' })
    }

    // Encriptamos nuestra password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(request.body.password, salt);
    console.log("mi password encriptada es: " + password) //aqui muestro mi password encriptada

    // Creación de nuestro usuario
    const user = new Usuario({
        nombre: request.body.name,
        email: request.body.email,
        password: password
    });

    try {
        await user.save();
        response.redirect('/usuarios')
        /* response.json({
             error: null,
             data: savedUser
         })*/
    } catch (error) {
        //console.log("este es el error: ", error)
        //response.status(400).json({ error });
        return response.render('404', { mensaje: error })
    }

});

// Código para dirigir la acción a la página Crear (Usuario)
router.get('/crearUsuario', (request, response) => {
    response.render('crearUsuario');
})

//Método para Eliminar Usuario ocupando el método DELETE {verbo HTTP}
router.delete('/:id', async (request, response) => {

    console.log("**** borrado del usuario ****");
    const id = request.params.id;
    console.log("ID: ", id);
    try {
        await Usuario.findByIdAndDelete(id, { userFindAndModify: false } //eliminar de mongoDB un Usuario por su id
        )
        response.redirect('/usuarios');  // mandar la acción a la vista usuarios
    } catch (error) {
        console.log(error);
    }
})

// Código para ver el usuario y posteriormente modificarlo
router.get('/verUsuario/:id', async (request, response) => {
    console.log("***ver Usuario***");
    const id = request.params.id;
    console.log("id", id);

    //llamamos al metodoFinOne que nos devuelve el objeto por su ID
    const usuarioBD = await Usuario.findOne({ _id: id })

    //aquí retornamos por consola su nombre, rut, apellido, password y correo del objeto Usuario
    //console.log("usuarioBD nombre ", usuarioBD.nombre);
    //console.log("usuarioBD email ", usuarioBD.email);
    //console.log("usuarioBD contraseña ", usuarioBD.password);
    //console.log("usuarioBD fecha ", usuarioBD.date);

    //aqui tomamos el archivo editarUsuario (nuestra vista al usuario) y le pasamos un objeto Usuario en este caso nombre, rut, apellido, password y correo
    response.render("editarUsuario", {
        nombre: usuarioBD.nombre,
        email: usuarioBD.email,
        password: usuarioBD.password,
        id: id
    });
})

//codigo para Editar Usuario
router.post("/verUsuario/editarUsuario/", async (request, response) => {
    console.log("**** Editar Usuario ****");
    //const body = request.body;
    const id = request.body.id;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(request.body.password, salt); 
   

    // Encriptamos intento de encriptar nuestra password y enseguida actualizar datos
    //const salt = await bcrypt.genSalt(10);
    //const password = await bcrypt.hash(request.body.password, salt);
    //console.log("mi password encriptada es: " + password) //aqui muestro mi password encriptada

    try {
        console.log("PW Encripted: ", password)
        await Usuario.findByIdAndUpdate(
            id, password, { userFindAndModify: false }  //aqui actualizamos los datos
        )
        response.redirect('/usuarios');  // Si todo resulta bien, mandamos redireccionamos nuestra vista de los usuarios registrados con los nuevos cambios generados

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;