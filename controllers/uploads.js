const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);//autenticar backend

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req = request, res = response) => {
  try {
    //  se ponde dentro de un try ya que es una promesa
    // y para poder capturar las respuesta del reject cuendo hay errores
    // const nombre = await subirArchivo(req.files, ['jpg', 'png'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }

  //
};

const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usurio con el id: ${id}`,
        });
      }
      break;

    //
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  //limpiar imagenes OLD - previas
  if (modelo.img) {
    // hay que borrar la imagen fisica del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    //
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  let nombre;
  try {
    //  se ponde dentro de un try ya que es una promesa
    // y para poder capturar las respuesta del reject cuendo hay errores
    // const nombre = await subirArchivo(req.files, ['jpg', 'png'], 'textos');
    nombre = await subirArchivo(req.files, undefined, coleccion);
    
  } catch (msg) {
    return res.status(400).json({ msg });
  }

  modelo.img = nombre;

  await modelo.save();

  res.json({
    modelo,
  });
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usurio con el id: ${id}`,
        });
      }
      break;

    //
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  //limpiar imagenes OLD - previas
  if (modelo.img) {
    // hay que borrar la imagen fisica de cloudinary
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');

    // elimina imagen de cloudinary
    cloudinary.uploader.destroy(public_id);
    
  }
  const {tempFilePath}  = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;

  await modelo.save();

  res.json({
    modelo,
  });
};

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usurio con el id: ${id}`,
        });
      }
      break;

    //
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  //cargar path de la imagen
  if (modelo.img) {
    // hay que borrar la imagen fisica del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    //
    if (fs.existsSync(pathImagen)) {
      
      return res.sendFile(pathImagen)

    }
  }

  const pathImagen = path.join(
    __dirname,
    "../assets/no-image.jpg"
  );

  res.sendFile(pathImagen)

};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};
