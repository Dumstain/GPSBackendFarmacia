// controllers/detallesVentaController.js

const DetallesVenta = require('../models/detallesVentaModel');

// Obtener todos los detalles de ventas
exports.obtenerDetallesVenta = async (req, res) => {
  try {
    const detalles = await DetallesVenta.obtenerTodos();
    res.json(detalles);
  } catch (err) {
    console.error('Error al obtener detalles de venta:', err.message);
    res.status(500).json({ error: 'Error al obtener detalles de venta' });
  }
};

// Obtener un detalle de venta por ID
exports.obtenerDetalleVentaPorId = async (req, res) => {
  try {
    const detalle = await DetallesVenta.obtenerPorId(req.params.detalle_id);
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle de venta no encontrado' });
    }
    res.json(detalle);
  } catch (err) {
    console.error('Error al obtener el detalle de venta:', err.message);
    res.status(500).json({ error: 'Error al obtener el detalle de venta' });
  }
};

// Crear un nuevo detalle de venta
exports.crearDetalleVenta = async (req, res) => {
  try {
    const { venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal } = req.body;

    const nuevoDetalleVenta = {
      venta_id,
      codigo_barras,
      cantidad,
      precio_unitario,
      descuento_aplicado,
      subtotal
    };

    const detalle_id = await DetallesVenta.crear(nuevoDetalleVenta);
    res.status(201).json({ mensaje: 'Detalle de venta creado exitosamente', detalle_id });
  } catch (err) {
    console.error('Error al crear el detalle de venta:', err.message);
    res.status(500).json({ error: 'Error al crear el detalle de venta' });
  }
};

// Actualizar un detalle de venta existente
exports.actualizarDetalleVenta = async (req, res) => {
  try {
    const { venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal } = req.body;

    const detalleActualizado = {
      venta_id,
      codigo_barras,
      cantidad,
      precio_unitario,
      descuento_aplicado,
      subtotal
    };

    await DetallesVenta.actualizar(req.params.detalle_id, detalleActualizado);
    res.json({ mensaje: 'Detalle de venta actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el detalle de venta:', err.message);
    res.status(500).json({ error: 'Error al actualizar el detalle de venta' });
  }
};

// Eliminar un detalle de venta
exports.eliminarDetalleVenta = async (req, res) => {
  try {
    await DetallesVenta.eliminar(req.params.detalle_id);
    res.json({ mensaje: 'Detalle de venta eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el detalle de venta:', err.message);
    res.status(500).json({ error: 'Error al eliminar el detalle de venta' });
  }
};
