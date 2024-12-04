// models/ventasModel.js

const db = require('../config/db');

const Ventas = {
  obtenerTodos: async () => {
    const [rows] = await db.query(`
      SELECT 
        v.*, 
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario
      FROM 
        Ventas v
      JOIN 
        Usuarios u ON v.usuario_id = u.usuario_id
      ORDER BY 
        v.fecha DESC
    `);
    return rows;
  },

  obtenerPorId: async (venta_id) => {
    const [rows] = await db.query(`
      SELECT 
        v.*, 
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario
      FROM 
        Ventas v
      JOIN 
        Usuarios u ON v.usuario_id = u.usuario_id
      WHERE 
        v.venta_id = ?
    `, [venta_id]);
    return rows[0];
  },

  crear: async (venta) => {
    const { usuario_id, total, status } = venta;
    const [result] = await db.query(
      `INSERT INTO Ventas (usuario_id, total, status)
       VALUES (?, ?, ?)`,
      [usuario_id, total, status]
    );
    return result.insertId;
  },

  actualizar: async (venta_id, venta) => {
    const { usuario_id, total, status } = venta;
    await db.query(
      `UPDATE Ventas SET usuario_id = ?, total = ?, status = ? WHERE venta_id = ?`,
      [usuario_id, total, status, venta_id]
    );
  },

  eliminar: async (venta_id) => {
    await db.query('DELETE FROM Ventas WHERE venta_id = ?', [venta_id]);
  },
};

module.exports = Ventas;
