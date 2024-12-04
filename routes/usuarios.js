// routes/usuarios.js

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { body } = require('express-validator'); // Importa 'body'
const auth = require('../middlewares/auth'); // Middleware de Autenticación
const authorize = require('../middlewares/authorize.js'); // Middleware de Autorización




// Obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener un usuario por ID
router.get('/:id', usuariosController.obtenerUsuarioPorId);

// Crear un nuevo usuario
router.post('/', usuariosController.crearUsuario);

// Actualizar un usuario existente
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar un usuario
router.delete('/:id', usuariosController.eliminarUsuario);

/**
 * Ruta para registrar un nuevo usuario.
 * Método: POST
 * URL: /api/usuarios/register
 */

router.post(
    '/register',
    [
      // Validaciones y sanitizaciones
      body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .isLength({ max: 100 })
        .withMessage('El nombre no debe exceder 100 caracteres.'),
      
      body('apellido')
        .notEmpty()
        .withMessage('El apellido es obligatorio.')
        .isLength({ max: 100 })
        .withMessage('El apellido no debe exceder 100 caracteres.'),
      
      body('telefono')
        .optional()
        .matches(/^[0-9]{7,15}$/)
        .withMessage('El teléfono debe contener solo números y tener entre 7 y 15 dígitos.'),
      
      body('email')
        .notEmpty()
        .withMessage('El email es obligatorio.')
        .isEmail()
        .withMessage('Debe proporcionar un email válido.')
        .isLength({ max: 150 })
        .withMessage('El email no debe exceder 150 caracteres.'),
      
      body('direccion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La dirección no debe exceder 500 caracteres.'),
      
      body('nombre_usuario')
        .optional()
        .isLength({ max: 50 })
        .withMessage('El nombre de usuario no debe exceder 50 caracteres.'),
      
      body('contraseña')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres.'),
      
      body('avatar')
        .optional()
        .isIn(['Avatar 1', 'Avatar 2', 'Avatar 3', 'Avatar 4'])
        .withMessage('El avatar debe ser uno de los siguientes: Avatar 1, Avatar 2, Avatar 3, Avatar 4.'),
      
      body('tipo_usuario')
        .notEmpty()
        .withMessage('El tipo de usuario es obligatorio.')
        .isIn(['ADMINISTRADOR', 'CLIENTE'])
        .withMessage('El tipo de usuario debe ser ADMINISTRADOR o CLIENTE.'),
    ],
    usuariosController.registrarUsuario
  );

  /**
 * Ruta para iniciar sesión.
 * Método: POST
 * URL: /api/usuarios/login
 */
router.post(
    '/login',
    [
      // Validaciones y sanitizaciones
      body('email')
        .notEmpty()
        .withMessage('El email es obligatorio.')
        .isEmail()
        .withMessage('Debe proporcionar un email válido.')
        .isLength({ max: 150 })
        .withMessage('El email no debe exceder 150 caracteres.')
        .normalizeEmail(),
      
      body('contraseña')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres.')
        .trim(),
    ],
    usuariosController.iniciarSesion
  );

  /** * Ruta protegida para obtener todos los usuarios que son administradores.
 * Método: GET
 * URL: /api/usuarios/admins
 */
router.get('/admins', auth, authorize('ADMINISTRADOR'), usuariosController.obtenerAdministradores);


module.exports = router;
