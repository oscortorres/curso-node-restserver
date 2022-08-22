const { response, request } = require("express");

const paramValidate = async (param, paramName, type, required) => {
  // console.log('param', param)
  // console.log('type', type)
  // console.log('required', required)

  let detalleVal = false;
  let valor;

  if (param === "") {
    detalleVal = true;
  }
  if (param === undefined && required === true) {
    detalleVal = true;
  }
  //
  if (detalleVal === true) {
    throw new Error(`Revisa detalles en: ${paramName}`);
  }
  //continua
  if (param !== undefined) {
    //
    if (type === "number") {
      valor = Number(param);
      //
      if (!valor) {
        throw new Error(`La propiedad: ${paramName} debe ser: ${type}`);
      }
    }
    //
  }
};

module.exports = {
  paramValidate,
};
