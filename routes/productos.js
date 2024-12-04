// routes/productos.js

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { body, param } = require('express-validator');
const multer = require('multer');
const path = require('path');



// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
      // Renombrar el archivo para evitar conflictos
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Obtener la extensión del archivo
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  // Filtro para aceptar solo ciertos tipos de archivos (imágenes)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    
    if (ext && mime) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
  };
  
  // Inicializar Multer
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño a 5MB
    fileFilter: fileFilter
  });
  
// Validaciones para crear un producto
const validarCrearProducto = [
  body('codigo_barras').isNumeric().withMessage('El código de barras debe ser numérico'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('categoria_id').isInt({ min: 1 }).withMessage('La categoría debe ser un número entero positivo'),
  body('unidades').isInt({ min: 0 }).withMessage('Las unidades deben ser un número entero no negativo'),
  body('precio').isDecimal().withMessage('El precio debe ser un número decimal'),
  body('descuento').optional().isDecimal().withMessage('El descuento debe ser un número decimal'),
  body('fecha').isISO8601().withMessage('La fecha debe ser una fecha válida'),
  body('status').optional().isIn(['ACTIVADO', 'DESACTIVADO']).withMessage('El estado debe ser ACTIVADO o DESACTIVADO'),
  body('imagen').optional().isString().withMessage('La imagen debe ser una cadena Base64 válida'),
];

// Validaciones para actualizar un producto
const validarActualizarProducto = [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('categoria_id').optional().isInt({ min: 1 }).withMessage('La categoría debe ser un número entero positivo'),
  body('unidades').optional().isInt({ min: 0 }).withMessage('Las unidades deben ser un número entero no negativo'),
  body('precio').optional().isDecimal().withMessage('El precio debe ser un número decimal'),
  body('descuento').optional().isDecimal().withMessage('El descuento debe ser un número decimal'),
  body('fecha').optional().isISO8601().withMessage('La fecha debe ser una fecha válida'),
  body('status').optional().isIn(['ACTIVADO', 'DESACTIVADO']).withMessage('El estado debe ser ACTIVADO o DESACTIVADO'),
  body('imagen').optional().isString().withMessage('La imagen debe ser una cadena Base64 válida'),
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

// Obtener todos los productos
router.get('/', productosController.obtenerProductos);

// Obtener un producto por código de barras
router.get('/:codigo_barras', productosController.obtenerProductoPorCodigo);

// Crear un nuevo producto
router.post(
  '/',
  manejarErrores,upload.single('imagen'),
  productosController.crearProducto
);

// Actualizar un producto existente
router.put(
  '/:codigo_barras',
  validarActualizarProducto,
  manejarErrores,upload.single('imagen'),
  productosController.actualizarProducto
);

// Eliminar un producto
router.delete('/:codigo_barras', productosController.eliminarProducto);

module.exports = router;
