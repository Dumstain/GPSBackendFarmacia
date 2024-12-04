// routes/ventas.js

const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { body, param } = require('express-validator');

// Validaciones para crear una venta
const validarCrearVenta = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El usuario_id debe ser un número entero positivo'),
  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Los detalles de la venta deben ser un arreglo no vacío'),
  body('detalles.*.codigo_barras')
    .matches(/^\d+$/)
    .withMessage('El codigo_barras debe contener solo dígitos'),
  body('detalles.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('detalles.*.precio_unitario')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El precio_unitario debe ser un número decimal con hasta 2 decimales'),
  body('detalles.*.descuento_aplicado')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El descuento_aplicado debe ser un número decimal con hasta 2 decimales'),
  body('detalles.*.subtotal')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El subtotal debe ser un número decimal con hasta 2 decimales'),
];

// Validaciones para actualizar una venta
const validarActualizarVenta = [
  body('usuario_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El usuario_id debe ser un número entero positivo'),
  body('total')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El total debe ser un número decimal con hasta 2 decimales'),
  body('status')
    .optional()
    .isIn(['PENDIENTE', 'COMPLETADA', 'CANCELADA'])
    .withMessage('El status debe ser PENDIENTE, COMPLETADA o CANCELADA'),
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

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para gestionar ventas
 */

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtiene todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 */
router.get('/', ventasController.obtenerVentas);

/**
 * @swagger
 * /api/ventas/{venta_id}:
 *   get:
 *     summary: Obtiene una venta por su ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: venta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 */
router.get('/:venta_id', ventasController.obtenerVentaPorId);

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Crea una nueva venta junto con sus detalles
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  ventasController.crearVenta
);

/**
 * @swagger
 * /api/ventas/{venta_id}:
 *   put:
 *     summary: Actualiza una venta existente
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: venta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Venta no encontrada
 */
router.put(
  '/:venta_id',
  validarActualizarVenta,
  manejarErrores,
  ventasController.actualizarVenta
);

/**
 * @swagger
 * /api/ventas/{venta_id}:
 *   delete:
 *     summary: Elimina una venta
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: venta_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la venta a eliminar
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       404:
 *         description: Venta no encontrada
 */
router.delete('/:venta_id', ventasController.eliminarVenta);

/**
 * @swagger
 * components:
 *   schemas:
 *     Venta:
 *       type: object
 *       required:
 *         - usuario_id
 *         - detalles
 *       properties:
 *         venta_id:
 *           type: integer
 *           description: ID único de la venta
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario que realizó la venta
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la venta
 *         total:
 *           type: number
 *           format: float
 *           description: Total de la venta
 *         status:
 *           type: string
 *           enum: [PENDIENTE, COMPLETADA, CANCELADA]
 *           description: Estado de la venta
 *         detalles:
 *           type: array
 *           description: Detalles de la venta
 *           items:
 *             $ref: '#/components/schemas/DetalleVenta'
 * 
 *     DetalleVenta:
 *       type: object
 *       required:
 *         - codigo_barras
 *         - cantidad
 *         - precio_unitario
 *         - subtotal
 *       properties:
 *         detalle_id:
 *           type: integer
 *           description: ID único del detalle de venta
 *         venta_id:
 *           type: integer
 *           description: ID de la venta asociada
 *         codigo_barras:
 *           type: integer
 *           description: Código de barras del producto
 *         cantidad:
 *           type: integer
 *           description: Cantidad vendida
 *         precio_unitario:
 *           type: number
 *           format: float
 *           description: Precio unitario del producto
 *         descuento_aplicado:
 *           type: number
 *           format: float
 *           description: Descuento aplicado al producto
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal de la venta para este producto
 */

module.exports = router;
