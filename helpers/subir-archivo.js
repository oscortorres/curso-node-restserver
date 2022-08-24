const { response } = require("express");
const { v4: uuidv4} = require("uuid");
const path = require("path");

const subirArchivo = (files, extensionesValidas = ["png", "jpg", "jpeg", "gif"], carpeta = '') => {


  return new Promise((resolve, reject) => {
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    //validar extension
    if (!extensionesValidas.includes(extension)) {      
        return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`);      
    }
    
    const nombreTem = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTem);

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, (err) => {
      if (err) {
        // console.log(err)
        // return res.status(500).json({ err });
        reject(err);
      }

    //   res.json({ msg: "File uploaded to " + uploadPath });
      resolve(nombreTem)
    });
  });
};

module.exports = {
  subirArchivo,
};
