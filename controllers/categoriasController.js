// controllers/categoriasController.js

const Categorias = require('../models/categoriasModel');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categorias.obtenerTodos();
    res.json(categorias);
  } catch (err) {
    console.error('Error al obtener categorías:', err.message);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categorias.obtenerPorId(req.params.categoria_id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    console.error('Error al obtener la categoría:', err.message);
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const nuevoCategoriaId = await Categorias.crear(req.body);
    res.status(201).json({ mensaje: 'Categoría creada', categoria_id: nuevoCategoriaId });
  } catch (err) {
    console.error('Error al crear la categoría:', err.message);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    await Categorias.actualizar(req.params.categoria_id, req.body);
    res.json({ mensaje: 'Categoría actualizada' });
  } catch (err) {
    console.error('Error al actualizar la categoría:', err.message);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    await Categorias.eliminar(req.params.categoria_id);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    console.error('Error al eliminar la categoría:', err.message);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
