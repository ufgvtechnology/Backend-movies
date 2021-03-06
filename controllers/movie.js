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

            // Guardar la pelicula
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

        // Buscar la película
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
        // Recoger el id del película por la url
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
                    movie: movieUpdated
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
                movie: movieRemoved
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
    },
    //Agregar almacenamiento de file para imagen de pelicula
      upload: (req, res) => {
        
        // Recoger el fichero de la petición
        var file_name = 'Imagen';

        //No se recibio un archivo
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //Nombre y la extensión del archivo
        var file_path = req.files.file0.path;
     
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            
            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                });
            });
        
        }else{
             // Si todo es válido, sacando id de la url
             var movieId = req.params.id;

             if(movieId){
                // Buscar el objeto pelicula, asignarle el nombre de la imagen y actualizarlo
                Movie.findOneAndUpdate({_id: movieId }, {image: file_name}, {new:true}, (err, movieUpdated) => {

                    if(err || !movieUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar imagen'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        movie: movieUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            
        }   
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/movies/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },


}

module.exports = Moviecontroller;
