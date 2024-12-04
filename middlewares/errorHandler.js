// middlewares/errorHandler.js

/**
 * Middleware para manejar errores de forma centralizada.
 * Captura cualquier error que ocurra en las rutas y lo devuelve en formato JSON.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Loggea el error en la consola para depuración
  
    // Define el estado HTTP y el mensaje de error
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message, // Puedes personalizar este mensaje según tus necesidades
    });
  };
  
  module.exports = errorHandler;
  