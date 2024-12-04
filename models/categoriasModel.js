// models/categoriasModel.js

const db = require('../config/db');

const Categorias = {
  obtenerTodos: async () => {
    const [rows] = await db.query('SELECT * FROM Categorias');
    return rows;
  },

  obtenerPorId: async (categoria_id) => {
    const [rows] = await db.query('SELECT * FROM Categorias WHERE categoria_id = ?', [categoria_id]);
    return rows[0];
  },

  crear: async (categoria) => {
    const { nombre } = categoria;
    const [result] = await db.query(
      'INSERT INTO Categorias (nombre) VALUES (?)',
      [nombre]
    );
    return result.insertId;
  },

  actualizar: async (categoria_id, categoria) => {
    const { nombre } = categoria;
    await db.query(
      'UPDATE Categorias SET nombre = ? WHERE categoria_id = ?',
      [nombre, categoria_id]
    );
  },

  eliminar: async (categoria_id) => {
    await db.query('DELETE FROM Categorias WHERE categoria_id = ?', [categoria_id]);
  },
};

module.exports = Categorias;
