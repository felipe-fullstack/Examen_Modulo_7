const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

//Datos para la conexión a MongoDB
const user = "pipe-aws-fullstack";
const password = "1ggwp";
const dbname = "empresa";
const url = "mongodb+srv://pipe-aws-fullstack:1ggwp@cluster0.6sq0o.mongodb.net/empresa?retryWrites=true&w=majority";

//Aquí me conecto al MongoDB
mongoose.connect(url,
    {
        useNewUrlParser: true, useUnifiedTopology: true
    }
    )
    .then(() => console.log("Base de datos conectada"))
    .catch( e => console.log(e))

// Motor de plantillas ejs y definición de rutas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Capturar datos del body
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Especificación de las rutas a ocupar
//app.use(express.static(__dirname + "/public"));
app.use('/', require('./router/RutasWeb'));
app.use('/', require('./router/auth')); // importación del router para la accion del login
app.use('/clientes', require('./router/ClientesRouter'));
app.use('/mascotas', require('./router/mascotaRouter'));
app.use('/usuarios', require('./router/UsuariosRouter'));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});