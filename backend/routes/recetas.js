const express = require('express');
const router = express.Router();
const Receta = require('../models/Receta');

// Obtener todas las recetas
router.get('/', async (req, res) => {
  try {
    const recetas = await Receta.find();
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
});

// Buscar recetas por texto
router.get('/buscar', async (req, res) => {
  const query = req.query.query;
  try {
    const recetas = await Receta.find({
      $or: [
        { titulo: new RegExp(query, 'i') },
        { ingredientes: new RegExp(query, 'i') },
        { instrucciones: new RegExp(query, 'i') }
      ]
    });
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar recetas' });
  }
});

// Obtener receta por ID
router.get('/:id', async (req, res) => {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(receta);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar la receta' });
  }
});

// Crear nueva receta
router.post('/', async (req, res) => {
  const nuevaReceta = new Receta(req.body);
  try {
    const recetaGuardada = await nuevaReceta.save();
    res.status(201).json(recetaGuardada);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar la receta' });
  }
});

// Actualizar receta por ID
router.put('/:id', async (req, res) => {
  try {
    const recetaActualizada = await Receta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recetaActualizada) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json(recetaActualizada);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar la receta' });
  }
});

// Eliminar receta por ID
router.delete('/:id', async (req, res) => {
  try {
    const recetaEliminada = await Receta.findByIdAndDelete(req.params.id);
    if (!recetaEliminada) return res.status(404).json({ error: 'Receta no encontrada' });
    res.json({ mensaje: 'Receta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
});

module.exports = router;
