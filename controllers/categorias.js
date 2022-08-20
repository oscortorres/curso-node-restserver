const { response, request } = require("express");
const { Categoria } = require("../models");

//obtener categorias - paginado - total - populate

const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  //

  // se tenian dos peticiones asincronas a BD
  // se metieron las 2 en una promesa para ejecutarlas al mismo tiempo
  // mas rapido el proceso
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite)),
  ]);

  res.json({
    total,
    categorias,
  });
};

const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    
    // if (!categoria) {
    //     return res.status(400).json({
    //         msg: `La categoria ${categoriaBD.nombre}, ya existe`,
    //       });
    // }

  
    res.json({
      categoria,
    });
  };

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaBD = await Categoria.findOne({ nombre });

  if (categoriaBD) {
    return res.status(400).json({
      msg: `La categoria ${categoriaBD.nombre}, ya existe`,
    });
  }

  //generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  //prepara bd
  const categoria = new Categoria(data);
  //guardar db
  categoria.save();

  res.status(201).json({
    categoria,
  });
};

const actualizarCategoria = async(req = request, res = response) =>{
    const { id } = req.params; 

    //extraer estado y usuario para que no puedan ser actualizados
    const {estado, usuario, ...data} = req.body;
    //convertir nombre a mayusculas
    data.nombre = data.nombre.toUpperCase();
    //escribir el usuario que esta actualizando dueno del token
    data.usuario = req.usuario._id;
    //
    const nombre = data.nombre;
    const categoriaBD = await Categoria.findOne({ nombre });

    if (categoriaBD) {
      return res.status(400).json({
        msg: `La categoria ${categoriaBD.nombre}, ya existe`,
      });
    }
    // {new: true}  manda el nuevo documento actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoria
    })
}  

const borrarCategoria = async(req = request, res = response) =>{
    const { id } = req.params; 
  
    //
    const data = {
        estado: false
    }
    
    // {new: true}  manda el nuevo documento actualizado
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        categoriaBorrada
    })
}

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
