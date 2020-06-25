'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');


var controller = {


    datosProyecto: (req, res) => {
      
        return res.status(200).send({
            proyecto: 'Proyecto en Node.js / Desarrollo de Back-end REST',
            autor: 'Vanessa Urquiza Technology',
            url: 'https://github.com/ufgvtechnology'
              
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Acción test de controlador'
        });
    },

}

module.exports = controller;