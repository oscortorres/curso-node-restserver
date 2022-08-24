const { response, request } = require("express");
const { Categoria, Role, usuario, Producto } = require("../models");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  // asi se retorna el error personalizado
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  //verificar si el correo existe
  const existeEmail = await usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado en la BD`);
  }
};

const existeUsuarioPorId = async (id) => {
  //verificar si el id existe
  const existeUsuario = await usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existeCategoriaPorId = async (id) => {
  //verificar si el id existe
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existeCategoriaPorIdEstadoTrue = async (id) => {
  //verificar si el id existe
  const existeCategoria = await Categoria.findById(id);

  // console.log(existeCategoria)

  if (!existeCategoria) {
    throw new Error(`La categoría: no esta disponible`);
    // return;
  }
  //
  if (!existeCategoria.estado) {
    throw new Error(`La categoría: ${existeCategoria.nombre} no esta disponible`);
  }
};

const existeProductoPorId = async (id) => {
  //verificar si el id existe
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id no existe ${id}`);
  }
};  

// 
// valida colecciones permitidas

const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
    
  }
  return true;
}


module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeCategoriaPorIdEstadoTrue,
  existeProductoPorId,
  coleccionesPermitidas
};
