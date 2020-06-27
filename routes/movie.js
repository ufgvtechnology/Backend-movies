'use strict'

var express = require('express');
var MovieController = require('../controllers/movie');

var router = express.Router();

//Multipart almacenamiento de archivo: imagen
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/movies'});

// Rutas
router.post('/save', MovieController.save);
router.get('/movies/:last?',MovieController.getMovies);
router.get('/movie/:id',MovieController.getMovie);
router.put('/movie/:id', MovieController.update);
router.delete('/delete/:id',MovieController.delete);
router.get('/search/:search',MovieController.search);

//Agregar rutas para almacenamiento y admin de Files
router.post('/upload-image/:id?', md_upload, MovieController.upload);
router.get('/get-image/:image', MovieController.getImage);




module.exports = router;