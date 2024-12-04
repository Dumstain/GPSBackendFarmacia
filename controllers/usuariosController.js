// controllers/usuariosController.js

const Usuarios = require('../models/usuariosModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


/**
 * Registrar un nuevo usuario.
 */
exports.registrarUsuario = async (req, res) => {
  try {
    // Validar las entradas usando express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Retornar los errores de validación
      return res.status(400).json({ errores: errors.array() });
    }

    const { nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario } = req.body;

    // Verificar si el email ya está registrado
    const usuarioExistente = await Usuarios.obtenerPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Verificar si el nombre de usuario ya está en uso (si se proporciona)
    if (nombre_usuario) {
      const usuarioNombreExistente = await Usuarios.obtenerPorNombreUsuario(nombre_usuario);
      if (usuarioNombreExistente) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
      }
    }

    // Encriptar la contraseña usando bcrypt
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);

    // Crear el usuario en la base de datos
    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      nombre_usuario,
      contraseña: contraseñaEncriptada,
      avatar: avatar || 'Avatar 1', // Valor por defecto si no se proporciona
      tipo_usuario,
    };

    const usuario_id = await Usuarios.crear(nuevoUsuario);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', usuario_id });
  } catch (err) {
    console.error('Error al registrar usuario:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};


/**
 * Iniciar sesión de usuario.
 */
exports.iniciarSesion = async (req, res) => {
    try {
        // Validar las entradas usando express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { email, contraseña } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuarios.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Verificar la contraseña
        const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValido) {
            return res.status(400).json({ error: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const payload = {
            usuario: {
                id: usuario.usuario_id,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                avatar: usuario.avatar,
                tipo_usuario: usuario.tipo_usuario,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token y los datos del usuario
        res.json({
            token,
            usuario: {
                id: usuario.usuario_id,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                avatar: usuario.avatar,
                tipo_usuario: usuario.tipo_usuario,
                email: usuario.email, // Incluye solo información necesaria
            },
        });
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
};

  

/**
 * Obtener todos los usuarios.
 */
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.obtenerTodos();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};


/**
 * Obtener todos los usuarios que son administradores.
 */
exports.obtenerAdministradores = async (req, res) => {
    try {
      const administradores = await Usuarios.obtenerAdministradores();
      res.json(administradores);
    } catch (err) {
      console.error('Error al obtener administradores:', err.message);
      res.status(500).json({ error: 'Error en el servidor.' });
    }
  };

/**
 * Obtener un usuario por ID.
 */
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuarios.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (err) {
    console.error('Error al obtener usuario:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

/**
 * Crear un nuevo usuario (sin validaciones).
 */
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario } = req.body;

    // Verificar si el email ya está registrado
    const usuarioExistente = await Usuarios.obtenerPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Verificar si el nombre de usuario ya está en uso (si se proporciona)
    if (nombre_usuario) {
      const usuarioNombreExistente = await Usuarios.obtenerPorNombreUsuario(nombre_usuario);
      if (usuarioNombreExistente) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso.' });
      }
    }

    // Encriptar la contraseña usando bcrypt
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);

    // Crear el usuario en la base de datos
    const nuevoUsuario = {
      nombre,
      apellido,
      telefono,
      email,
      direccion,
      nombre_usuario,
      contraseña: contraseñaEncriptada,
      avatar: avatar || 'Avatar 1', // Valor por defecto si no se proporciona
      tipo_usuario,
    };

    const usuario_id = await Usuarios.crear(nuevoUsuario);

    res.status(201).json({ mensaje: 'Usuario creado exitosamente.', usuario_id });
  } catch (err) {
    console.error('Error al crear usuario:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

/**
 * Actualizar un usuario existente.
 */
exports.actualizarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, direccion, nombre_usuario, contraseña, avatar, tipo_usuario } = req.body;
    const usuario_id = req.params.id;

    // Verificar si el usuario existe
    const usuarioExistente = await Usuarios.obtenerPorId(usuario_id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Verificar si el email ya está registrado por otro usuario
    if (email && email !== usuarioExistente.email) {
      const emailEnUso = await Usuarios.obtenerPorEmail(email);
      if (emailEnUso) {
        return res.status(400).json({ error: 'El email ya está registrado por otro usuario.' });
      }
    }

    // Verificar si el nombre de usuario ya está en uso por otro usuario
    if (nombre_usuario && nombre_usuario !== usuarioExistente.nombre_usuario) {
      const nombreUsuarioEnUso = await Usuarios.obtenerPorNombreUsuario(nombre_usuario);
      if (nombreUsuarioEnUso) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso por otro usuario.' });
      }
    }

    // Encriptar la contraseña si se proporciona
    let contraseñaEncriptada = usuarioExistente.contraseña;
    if (contraseña) {
      const saltRounds = 10;
      contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);
    }

    // Actualizar el usuario en la base de datos
    const usuarioActualizado = {
      nombre: nombre || usuarioExistente.nombre,
      apellido: apellido || usuarioExistente.apellido,
      telefono: telefono || usuarioExistente.telefono,
      email: email || usuarioExistente.email,
      direccion: direccion || usuarioExistente.direccion,
      nombre_usuario: nombre_usuario || usuarioExistente.nombre_usuario,
      contraseña: contraseñaEncriptada,
      avatar: avatar || usuarioExistente.avatar,
      tipo_usuario: tipo_usuario || usuarioExistente.tipo_usuario,
    };

    await Usuarios.actualizar(usuario_id, usuarioActualizado);

    res.json({ mensaje: 'Usuario actualizado exitosamente.' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};

/**
 * Eliminar un usuario.
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario_id = req.params.id;

    // Verificar si el usuario existe
    const usuarioExistente = await Usuarios.obtenerPorId(usuario_id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Eliminar el usuario
    await Usuarios.eliminar(usuario_id);

    res.json({ mensaje: 'Usuario eliminado exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err.message);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
};
