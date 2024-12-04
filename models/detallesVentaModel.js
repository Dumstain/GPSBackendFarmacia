// models/detallesVentaModel.js

const db = require('../config/db');

const DetallesVenta = {
  obtenerTodos: async () => {
    const [rows] = await db.query(`
      SELECT 
        dv.*, 
        p.nombre AS nombre_producto
      FROM 
        DetallesVenta dv
      JOIN 
        Productos p ON dv.codigo_barras = p.codigo_barras
      ORDER BY 
        dv.detalle_id DESC
    `);
    return rows;
  },

  obtenerPorId: async (detalle_id) => {
    const [rows] = await db.query(`
      SELECT 
        dv.*, 
        p.nombre AS nombre_producto
      FROM 
        DetallesVenta dv
      JOIN 
        Productos p ON dv.codigo_barras = p.codigo_barras
      WHERE 
        dv.detalle_id = ?
    `, [detalle_id]);
    return rows[0];
  },

  obtenerPorVentaId: async (venta_id) => {
    const [rows] = await db.query(`
      SELECT 
        dv.*, 
        p.nombre AS nombre_producto
      FROM 
        DetallesVenta dv
      JOIN 
        Productos p ON dv.codigo_barras = p.codigo_barras
      WHERE 
        dv.venta_id = ?
    `, [venta_id]);
    return rows;
  },

  crear: async (detalleVenta) => {
    const { venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal } = detalleVenta;
    const [result] = await db.query(
      `INSERT INTO DetallesVenta (venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal]
    );
    return result.insertId;
  },

  actualizar: async (detalle_id, detalleVenta) => {
    const { venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal } = detalleVenta;
    await db.query(
      `UPDATE DetallesVenta 
       SET venta_id = ?, codigo_barras = ?, cantidad = ?, precio_unitario = ?, descuento_aplicado = ?, subtotal = ?
       WHERE detalle_id = ?`,
      [venta_id, codigo_barras, cantidad, precio_unitario, descuento_aplicado, subtotal, detalle_id]
    );
  },

  eliminar: async (detalle_id) => {
    await db.query('DELETE FROM DetallesVenta WHERE detalle_id = ?', [detalle_id]);
  },
};

module.exports = DetallesVenta;
