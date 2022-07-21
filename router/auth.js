const User = require('../models/usuarios');
const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");

// Capturar datos del body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// Scheme para realizar el Login del Usuario
const schemeLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

// Código para logear a un usuario
router.post('/login', async (request, response) => {
    // Validaciones
    const { error } = schemeLogin.validate(request.body);
    if (error)
        //return response.status(400).json({ error: error.details[0].message })
        return response.render('404', { mensaje: 'Estimado Usuario, no ha ingresado ningún dato. Intente nuevamente' })

    // Verificamos si el usuario existe (su email)
    const user = await User.findOne({ email: request.body.email });
    if (!user)
        //return response.status(400).json({ error: 'Usuario No Encontrado' });
        return response.render('404', { mensaje: 'Usuario No Encontrado en nuestro sistema. Intente nuevamente' })

    // Verificar el password del usuario
    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword)
        //return response.status(400).json({ error: 'Contraseña no válida'});
        return response.render('404', { mensaje: 'Contraseña no es válida. Intente nuevamente' })

    // Creamos el Token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET);

    response.render('exito', { msj: 'Bienvenido estimad(a)o Usuario: ' + user.nombre, msj2: 'ha sido ingresado exitosamente', msj3: 'su token de validación es: ', token: token });

    //En Resumen lo realizado:
    // Validamos los datos.
    // Verificamos que existe el usuario.
    // Desencriptamos la password que está en la BBDD Tomamos la contraseña y comparamos con la contraseña de la BD.
    // Si todo sale bien, mandamos un mensaje de bienvenida, nombrando el usuario que se está ingresando.
    // Generamos el Token, y lo publicamos en nuestra página de Bienvenida.
})

module.exports = router;

