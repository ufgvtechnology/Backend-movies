'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

//Agregar modelo Movie
var Movie = require('../models/movie');

var Moviecontroller = {

    save: (req, res) => {


        // Recoger parametros por post
        var params = req.body;


        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_synopsis = !validator.isEmpty(params.synopsis);
            var validate_genre = !validator.isEmpty(params.genre);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Datos incompletos'
            });
        }

        if (validate_title && validate_synopsis && validate_genre) {

            //Crear el objeto a guardar
            var movie = new Movie();


            // Asignar valores
            movie.title = params.title;
            movie.synopsis = params.synopsis;
            movie.genre = params.genre;

            if (params.image) {
                movie.image = movie.image;
            } else {
                movie.image = null;
            }

            // Guardar el articulo
            movie.save((err, movieStored) => {

                if (err || !movieStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Pelicula no almacenada'
                    });
                }

                // Devolver una respuesta 
                return res.status(200).send({
                    status: 'success',
                    movie: movieStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Datos inválidos'
            });
        }

    },

    getMovies: (req, res) => {

        var query = Movie.find({});

        var last = req.params.last;

        // Si se manda la variable last
        if (last || last != undefined) {
            //Resultados limite a cinco
            query.limit(5);
        }

        // Ordenar resultados descendente
        query.sort('-_id').exec((err, movies) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver películas'
                });
            }

            if (!movies) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay películas registradas'
                });
            }

            return res.status(200).send({
                status: 'success',
                movies
            });

        });
    },

    getMovie: (req, res) => {

        // Recoger el id de la url
        var movieId = req.params.id;

        // Comprobar que existe
        if (!movieId || movieId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe pelicula'
            });
        }

        // Buscar el articulo
        Movie.findById(movieId, (err, movie) => {

            if (err || !movie) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe pelicula'
                });
            }

            // Devolverlo en JSON
            return res.status(200).send({
                status: 'success',
                movie
            });

        });
    },
    update: (req, res) => {
        // Recoger el id del articulo por la url
        var movieId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_synopsis = !validator.isEmpty(params.synopsis);
            var validate_genre = !validator.isEmpty(params.genre);


        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Datos incompletos'
            });
        }

        if (validate_title && validate_synopsis && validate_genre) {
            // Find and update
            Movie.findOneAndUpdate({ _id: movieId }, params, { new: true }, (err, movieUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar datos'
                    });
                }

                if (!movieUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La pelicula no existe'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: movieUpdated
                });
            });
        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }

    },

    delete: (req, res) => {
        // Recoger el id de la url
        var movieId = req.params.id;

        // Find and delete
        Movie.findOneAndDelete({_id: movieId}, (err, movieRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }

            if(!movieRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado la película, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: movieRemoved
            });

        }); 
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Movie.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "synopsis": { "$regex": searchString, "$options": "i"}},
            //{ "genre": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, movies) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }
            
            if(!movies || movies.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay coincidencias'
                });
            }

            return res.status(200).send({
                status: 'success',
                movies
            });

        });
    }
    //Agregar almacenamiento de file para imagen de pelicula

}

module.exports = Moviecontroller;
