'use strict'

// Cargar modulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var routes = require('./routes/prueba');


// Añadir prefijos a rutas / Cargar rutas
app.use('/',routes);

// Exportar modulo (fichero actual)
module.exports = app;