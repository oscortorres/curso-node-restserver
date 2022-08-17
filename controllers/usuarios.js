const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
    const {q, nombre = 'no name', apikey} = req.query;

  res.json({
    msg: "get API - controlador get",
    q, 
    nombre, 
    apikey,
  });
};

const usuariosPost = (req, res = response) => {
  const {nombre, edad} = req.body;

  res.json({
    msg: "post API - controlador post",
    nombre,
    edad,
  });
};

const usuariosPut = (req, res = response) => {
     const {id} = req.params;

  res.json({
    msg: "put API - controlador put",
    id
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - controlador patch",
  });
};

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API - controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
