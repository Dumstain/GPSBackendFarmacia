// models/productosModel.js

const db = require('../config/db');

const Productos = {
  obtenerTodos: async () => {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria 
      FROM 
        Productos p
      LEFT JOIN 
        Categorias c ON p.categoria_id = c.categoria_id
    `);
    return rows;
  },

  obtenerPorCodigo: async (codigo_barras) => {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        c.nombre AS categoria 
      FROM 
        Productos p
      LEFT JOIN 
        Categorias c ON p.categoria_id = c.categoria_id
      WHERE 
        p.codigo_barras = ?
    `, [codigo_barras]);
    return rows[0];
  },

  crear: async (producto) => {
    const { codigo_barras, nombre, categoria_id, unidades, precio, descuento, fecha, status, imagen } = producto;
    const [result] = await db.query(
      `INSERT INTO Productos (codigo_barras, nombre, categoria_id, unidades, precio, descuento, fecha, status, imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_barras, nombre, categoria_id, unidades, precio, descuento, fecha, status, imagen]
    );
    return result.insertId;
  },

  actualizar: async (codigo_barras, producto) => {
    const { nombre, categoria_id, unidades, precio, descuento, fecha, status, imagen } = producto;
    // Construir dinámicamente la consulta para solo actualizar los campos proporcionados
    let campos = [];
    let valores = [];

    if (nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(nombre);
    }
    if (categoria_id !== undefined) {
      campos.push('categoria_id = ?');
      valores.push(categoria_id);
    }
    if (unidades !== undefined) {
      campos.push('unidades = ?');
      valores.push(unidades);
    }
    if (precio !== undefined) {
      campos.push('precio = ?');
      valores.push(precio);
    }
    if (descuento !== undefined) {
      campos.push('descuento = ?');
      valores.push(descuento);
    }
    if (fecha !== undefined) {
      campos.push('fecha = ?');
      valores.push(fecha);
    }
    if (status !== undefined) {
      campos.push('status = ?');
      valores.push(status);
    }
    if (imagen !== undefined) {
      campos.push('imagen = ?');
      valores.push(imagen);
    }

    valores.push(codigo_barras);

    const consulta = `UPDATE Productos SET ${campos.join(', ')} WHERE codigo_barras = ?`;

    await db.query(consulta, valores);
  },

  eliminar: async (codigo_barras) => {
    await db.query('DELETE FROM Productos WHERE codigo_barras = ?', [codigo_barras]);
  },
};

module.exports = Productos;
