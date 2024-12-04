// routes/categorias.js

const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { body } = require('express-validator');

// Validaciones para crear una categoría
const validarCrearCategoria = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
];

// Validaciones para actualizar una categoría
const validarActualizarCategoria = [
  body('nombre')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
];

// Middleware para manejar errores de validación
const { validationResult } = require('express-validator');

const manejarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// Obtener todas las categorías
router.get('/', categoriasController.obtenerCategorias);

// Obtener una categoría por ID
router.get('/:categoria_id', categoriasController.obtenerCategoriaPorId);

// Crear una nueva categoría
router.post(
  '/',
  validarCrearCategoria,
  manejarErrores,
  categoriasController.crearCategoria
);

// Actualizar una categoría existente
router.put(
  '/:categoria_id',
  validarActualizarCategoria,
  manejarErrores,
  categoriasController.actualizarCategoria
);

// Eliminar una categoría
router.delete('/:categoria_id', categoriasController.eliminarCategoria);

module.exports = router;
