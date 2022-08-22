const { response, request } = require("express");
const { Producto, Categoria } = require("../models");

//obtener productos - paginado - total - populate

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  //

  // se tenian dos peticiones asincronas a BD
  // se metieron las 2 en una promesa para ejecutarlas al mismo tiempo
  // mas rapido el proceso
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    productos,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    producto,
  });
};

const crearProducto = async (req = request, res = response) => {
  // excluir estado, usuario
  const { estado, usuario, ...body } = req.body;
  //
  body.nombre = body.nombre.toUpperCase();
  const nombre = body.nombre;

  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  // console.log(data)

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  res.status(201).json({
    producto,
  });
  //
};

const actualizarProducto = async (req = request, res = response) => {

  const { id } = req.params;

  //extraer estado y usuario para que no puedan ser actualizados
  const { estado, usuario, ...data } = req.body;
  //convertir nombre a mayusculas
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  //escribir el usuario que esta actualizando dueno del token
  data.usuario = req.usuario._id;
  //  
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json({
    producto,
  });
};

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  //
  const data = {
    estado: false,
  };

  // {new: true}  manda el nuevo documento actualizado
  const productoBorrado = await Producto.findByIdAndUpdate(id, data, {
    new: true,
  });

  res.json({
    productoBorrado,
  });
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
