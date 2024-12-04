// index.js

require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const ventasRoutes = require('./routes/ventas');           // Nueva ruta
const detallesVentaRoutes = require('./routes/detallesVenta'); // Nueva ruta
const swaggerUi = require('swagger-ui-express');          // Para Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const cors = require('cors');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configuración de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mi Servidor Express',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // Ruta a los archivos de rutas
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: '¡Servidor Express funcionando correctamente!', data: rows });
  } catch (err) {
    console.error('Error en la consulta de prueba:', err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.use(cors());


// Rutas de usuarios
app.use('/api/usuarios', usuariosRoutes);

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Rutas de categorias
app.use('/api/categorias', categoriasRoutes);

// Rutas de ventas
app.use('/api/ventas', ventasRoutes);

// Rutas de detallesVenta
app.use('/api/detallesVenta', detallesVentaRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
