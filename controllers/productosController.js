// controllers/productosController.js

const Productos = require('../models/productosModel');
const path = require('path');


  
 /**
 * Crear un nuevo producto
 */
exports.crearProducto = async (req, res) => {
    try {
      const { codigo_barras, nombre, categoria_id, unidades, precio, descuento, fecha, status } = req.body;
      let imagenUrl = null;
  
      // Verificar si se ha subido una imagen
      if (req.file) {
        // Construir la URL de la imagen
        imagenUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
  
      const nuevoProducto = {
        codigo_barras: parseInt(codigo_barras),
        nombre,
        categoria_id: parseInt(categoria_id),
        unidades: parseInt(unidades),
        precio: parseFloat(precio),
        descuento: parseFloat(descuento) || 0,
        fecha,
        status: status || 'ACTIVADO',
        imagen: imagenUrl, // Guardar la URL de la imagen
      };
  
      await Productos.crear(nuevoProducto);
      res.status(201).json({ mensaje: 'Producto creado', codigo_barras: nuevoProducto.codigo_barras });
    } catch (err) {
      console.error('Error al crear el producto:', err.message);
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  };

  
// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Productos.obtenerTodos();
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por código de barras
exports.obtenerProductoPorCodigo = async (req, res) => {
  try {
    const producto = await Productos.obtenerPorCodigo(req.params.codigo_barras);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    console.error('Error al obtener el producto:', err.message);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};



// Actualizar un producto existente
exports.actualizarProducto = async (req, res) => {
  try {
    const { nombre, categoria_id, unidades, precio, descuento, fecha, status, imagen } = req.body;

    // Validar la imagen si se proporciona
    if (imagen && !esBase64ImagenValida(imagen)) {
      return res.status(400).json({ error: 'La imagen proporcionada no es una cadena Base64 válida.' });
    }

    const productoActualizado = {
      nombre,
      categoria_id: categoria_id ? parseInt(categoria_id) : undefined,
      unidades: unidades ? parseInt(unidades) : undefined,
      precio: precio ? parseFloat(precio) : undefined,
      descuento: descuento ? parseFloat(descuento) : undefined,
      fecha,
      status: status || undefined,
      imagen: imagen || undefined, // Solo actualiza si se proporciona una nueva imagen
    };

    await Productos.actualizar(req.params.codigo_barras, productoActualizado);
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    console.error('Error al actualizar el producto:', err.message);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  try {
    await Productos.eliminar(req.params.codigo_barras);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    console.error('Error al eliminar el producto:', err.message);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
