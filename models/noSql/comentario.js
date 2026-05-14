const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    texto: {
        type: String,
        required: true
    },

    autor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comentario', ComentarioSchema);