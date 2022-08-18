const Role = require("../models/role");
const usuario = require("../models/usuario");
const { response, request } = require("express");

const esRoleValido = async(rol = '') =>{
    const existeRol = await Role.findOne({rol});
    // asi se retorna el error personalizado
    if (!existeRol) {
        throw new Error(`El rol ${ rol} no está registrado en la BD`);            
    }
}

const emailExiste = async(correo = '') =>{
    //verificar si el correo existe
  const existeEmail = await usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${ correo} ya está registrado en la BD`);
  }
}

const existeUsuarioPorId = async(id) =>{
    //verificar si el id existe
  const existeUsuario = await usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${ id}`);
  }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}