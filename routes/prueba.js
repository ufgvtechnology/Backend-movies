'use strict'

var express = require('express');
var Controller = require('../controllers/prueba');

var router = express.Router();



// Rutas de prueba
router.post('/datos-proyecto', Controller.datosProyecto);
router.get('/test-de-controlador',Controller.test);




module.exports = router;