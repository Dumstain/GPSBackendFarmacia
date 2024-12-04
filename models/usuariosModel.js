// models/usuariosModel.js

const db = require('../config/db');

const Usuarios = {
  obtenerTodos: async () => {
    const [rows] = await db.query('SELECT * FROM Usuarios');
    return rows;
  },
  
  obtenerPorId: async (id) => {
    const [rows] = await db.query('SELECT * FROM Usuarios WHERE usuario_id = ?', [id]);
    return rows[0];
  },

  obtenerPorEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
    return rows[0];
  },

  obtenerPorNombreUsuario: async (nombre_usuario) => {
    const [rows] = await db.query('SELECT * FROM Usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
    return rows[0];
  },

  obtenerAdministradores: async () => {
    const [rows] = await db.query("SELECT * FROM Usuarios WHERE tipo_usuario = 'ADMINISTRADOR'");
    return rows;
  },
  
  crear: async (usuario) => {
    const { nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario } = usuario;
    const [result] = await db.query(
      `INSERT INTO Usuarios (nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario]
    );
    return result.insertId;
  },
  
  actualizar: async (id, usuario) => {
    const { nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario } = usuario;
    await db.query(
      `UPDATE Usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ?, nombre_usuario = ?, contraseña = ?, avatar = ?, tipo_usuario = ? WHERE usuario_id = ?`,
      [nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario, id]
    );
  },
  
  eliminar: async (id) => {
    await db.query('DELETE FROM Usuarios WHERE usuario_id = ?', [id]);
  },
};

module.exports = Usuarios;
