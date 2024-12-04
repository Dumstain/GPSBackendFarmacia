// middlewares/auth.js

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT y autenticar al usuario.
 * 
 * - Extrae el token del encabezado 'Authorization'.
 * - Verifica la validez del token.
 * - Si es válido, añade la información del usuario al objeto 'req'.
 * - Si no, devuelve un error de autenticación.
 */
const auth = (req, res, next) => {
  // Obtener el token del encabezado 'Authorization'
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó el token de autenticación.' });
  }

  // El formato esperado es "Bearer <token>"
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de token inválido. Formato esperado: Bearer <token>' });
  }

  const token = partes[1];

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Añadir la información del usuario al objeto 'req'
    req.usuario = decoded.usuario;

    // Continuar con la siguiente función o middleware
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = auth;
