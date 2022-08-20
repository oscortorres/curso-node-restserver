const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / password no son correctos - correo",
      });
    }

    //si el usuario esta activado
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / password no son correctos - estado: false",
      });
    }

    // verificar la contrasena
    const validarPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        msg: "Usuario / password no son correctos - password",
      });
    }

    // gererar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;
  
  try {

    const {nombre, img, correo} = await googleVerify(id_token);    

    let usuario = await Usuario.findOne({correo});    

    if (!usuario) {
      //tengo que crearlo
      const data = {
        nombre,
        correo,
        password: 'CaritaFely',
        img,
        google: true
      }

      usuario = new Usuario(data);
      await usuario.save();     
      
    }

    //si el usuario en BD tiene estado false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      })
    }    

     // gererar el JWT
     const token = await generarJWT(usuario.id);     

    res.json({
      usuario,
      token,
    });
    //
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El Token no se pudo verificar',
    })

  }

};

module.exports = {
  login,
  googleSignIn,
};
