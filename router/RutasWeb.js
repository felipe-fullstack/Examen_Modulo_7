const express = require("express");
const router = express.Router();

//aquí enviamos nuestra página de inicio index.html y un mensaje titulo por objeto y despues lo recibimos en nuestro index para mostrar
router.get('/', (request, response) => {
    response.render("index", { titulo: "Veterinaria" });
});

module.exports = router;