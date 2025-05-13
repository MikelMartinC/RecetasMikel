const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  ingredientes: { type: String, required: true },
  instrucciones: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receta', recetaSchema);
