'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = Schema({
    title: String,
    synopsis: String,
    genre: String,
    date: { type: Date, default: Date.now },
    image: String

});

module.exports = mongoose.model('Movie', MovieSchema);

