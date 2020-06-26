'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

var bd="cinema";

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/'+bd, { useNewUrlParser: true })
        .then(() => {
            console.log('Conexión a base de datos exitosa');

            // Crear servidor y ponerme a escuchar peticiones HTTP
            app.listen(port, () => {
                console.log('Servidor corriendo en http://localhost:'+port);
            });

        });