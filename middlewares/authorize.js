// middlewares/authorize.js

/**
 * Middleware para autorizar usuarios según su rol.
 * 
 * @param {Array|string} roles - Rol(es) permitidos para acceder a la ruta.
 * 
 * - Si 'roles' es una cadena, se convierte en un arreglo con un solo elemento.
 * - Verifica si el rol del usuario está incluido en los roles permitidos.
 * - Si está permitido, continúa con la siguiente función o middleware.
 * - Si no, devuelve un error de autorización.
 */
const authorize = (roles = []) => {
    // Asegurarse de que 'roles' sea un arreglo
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.usuario || !roles.includes(req.usuario.tipo_usuario)) {
        return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.' });
      }
      next();
    };
  };
  
  module.exports = authorize;
  