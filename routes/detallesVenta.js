// routes/detallesVenta.js

const express = require('express');
const router = express.Router();
const detallesVentaController = require('../controllers/detallesVentaController');
const { body, param } = require('express-validator');

// Validaciones para crear un detalle de venta
const validarCrearDetalleVenta = [
  body('venta_id')
    .isInt({ min: 1 })
    .withMessage('El venta_id debe ser un número entero positivo'),
  body('codigo_barras')
    .matches(/^\d+$/)
    .withMessage('El codigo_barras debe contener solo dígitos'),
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('precio_unitario')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El precio_unitario debe ser un número decimal con hasta 2 decimales'),
  body('descuento_aplicado')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El descuento_aplicado debe ser un número decimal con hasta 2 decimales'),
  body('subtotal')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El subtotal debe ser un número decimal con hasta 2 decimales'),
];

// Validaciones para actualizar un detalle de venta
const validarActualizarDetalleVenta = [
  body('venta_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El venta_id debe ser un número entero positivo'),
  body('codigo_barras')
    .optional()
    .matches(/^\d+$/)
    .withMessage('El codigo_barras debe contener solo dígitos'),
  body('cantidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('precio_unitario')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El precio_unitario debe ser un número decimal con hasta 2 decimales'),
  body('descuento_aplicado')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El descuento_aplicado debe ser un número decimal con hasta 2 decimales'),
  body('subtotal')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El subtotal debe ser un número decimal con hasta 2 decimales'),
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
 *   name: DetallesVenta
 *   description: API para gestionar detalles de ventas
 */

/**
 * @swagger
 * /api/detallesVenta:
 *   get:
 *     summary: Obtiene todos los detalles de ventas
 *     tags: [DetallesVenta]
 *     responses:
 *       200:
 *         description: Lista de detalles de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleVenta'
 */
router.get('/', detallesVentaController.obtenerDetallesVenta);

/**
 * @swagger
 * /api/detallesVenta/{detalle_id}:
 *   get:
 *     summary: Obtiene un detalle de venta por su ID
 *     tags: [DetallesVenta]
 *     parameters:
 *       - in: path
 *         name: detalle_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de venta
 *     responses:
 *       200:
 *         description: Detalle de venta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleVenta'
 *       404:
 *         description: Detalle de venta no encontrado
 */
router.get('/:detalle_id', detallesVentaController.obtenerDetalleVentaPorId);

/**
 * @swagger
 * /api/detallesVenta:
 *   post:
 *     summary: Crea un nuevo detalle de venta
 *     tags: [DetallesVenta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       201:
 *         description: Detalle de venta creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/',
  
  detallesVentaController.crearDetalleVenta
);

/**
 * @swagger
 * /api/detallesVenta/{detalle_id}:
 *   put:
 *     summary: Actualiza un detalle de venta existente
 *     tags: [DetallesVenta]
 *     parameters:
 *       - in: path
 *         name: detalle_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de venta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       200:
 *         description: Detalle de venta actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Detalle de venta no encontrado
 */
router.put(
  '/:detalle_id',
  validarActualizarDetalleVenta,
  manejarErrores,
  detallesVentaController.actualizarDetalleVenta
);

/**
 * @swagger
 * /api/detallesVenta/{detalle_id}:
 *   delete:
 *     summary: Elimina un detalle de venta
 *     tags: [DetallesVenta]
 *     parameters:
 *       - in: path
 *         name: detalle_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de venta a eliminar
 *     responses:
 *       200:
 *         description: Detalle de venta eliminado exitosamente
 *       404:
 *         description: Detalle de venta no encontrado
 */
router.delete('/:detalle_id', detallesVentaController.eliminarDetalleVenta);

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleVenta:
 *       type: object
 *       required:
 *         - venta_id
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
