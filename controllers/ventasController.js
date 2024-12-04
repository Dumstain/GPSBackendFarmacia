// controllers/ventasController.js

const Ventas = require('../models/ventasModel');
const DetallesVenta = require('../models/detallesVentaModel');
const { validationResult } = require('express-validator');

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Ventas.obtenerTodos();
    res.json(ventas);
  } catch (err) {
    console.error('Error al obtener ventas:', err.message);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};

// Obtener una venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Ventas.obtenerPorId(req.params.venta_id);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Obtener detalles de la venta
    const detalles = await DetallesVenta.obtenerPorVentaId(req.params.venta_id);
    venta.detalles = detalles;

    res.json(venta);
  } catch (err) {
    console.error('Error al obtener la venta:', err.message);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
};

// Crear una nueva venta junto con sus detalles
exports.crearVenta = async (req, res) => {
  try {
    const { usuario_id, detalles } = req.body;

    // Validar que detalles es un arreglo y no está vacío
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ error: 'Detalles de la venta son requeridos y deben ser un arreglo no vacío.' });
    }

    // Calcular el total
    let total = 0;
    detalles.forEach(detalle => {
      total += detalle.subtotal;
    });

    // Crear la venta
    const nuevaVenta = {
      usuario_id,
      total,
      status: 'COMPLETADA' // Puedes ajustar según tu lógica
    };

    const venta_id = await Ventas.crear(nuevaVenta);

    // Crear los detalles de la venta
    for (const detalle of detalles) {
      detalle.venta_id = venta_id;
      await DetallesVenta.crear(detalle);
    }

    res.status(201).json({ mensaje: 'Venta creada exitosamente', venta_id });
  } catch (err) {
    console.error('Error al crear la venta:', err.message);
    res.status(500).json({ error: 'Error al crear la venta' });
  }
};

// Actualizar una venta existente
exports.actualizarVenta = async (req, res) => {
  try {
    const { usuario_id, total, status } = req.body;

    const ventaActualizada = {
      usuario_id,
      total,
      status
    };

    await Ventas.actualizar(req.params.venta_id, ventaActualizada);
    res.json({ mensaje: 'Venta actualizada exitosamente' });
  } catch (err) {
    console.error('Error al actualizar la venta:', err.message);
    res.status(500).json({ error: 'Error al actualizar la venta' });
  }
};

// Eliminar una venta
exports.eliminarVenta = async (req, res) => {
  try {
    await Ventas.eliminar(req.params.venta_id);
    res.json({ mensaje: 'Venta eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar la venta:', err.message);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};
