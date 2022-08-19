const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    //
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario en BD que corresponda al uid
    const usuario = await Usuario.findById(uid);

    // verificar si el usuario eiste en BD
    if (!usuario) {
        return res.status(401).json({
          msg: "Token no válido - usuario Borrado BD",
        });
      }

    // verificar si el usuario tiene estado en tru
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado false",
      });
    }

    // se carga inf. en el controlador desde aqui a la req
    req.usuario = usuario;
    //
    next();
    //
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validarJWT,
};
