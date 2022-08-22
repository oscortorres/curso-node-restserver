const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const {
  existeCategoriaPorId,
  existeCategoriaPorIdEstadoTrue,
  existeProductoPorId,
} = require("../helpers/db-validators");
const { paramValidate } = require("../helpers/param-validator");
const { validarJWT, validarCampos, tieneRole } = require("../middlewares");

const router = Router();

// {{url}}/api/productos

//obtener todos los productos - publico
router.get("/", obtenerProductos);

// obtener una producto por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom((id) => existeProductoPorId(id)),
    validarCampos,
  ],
  obtenerProducto
);

//crear producto - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id valido de mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorIdEstadoTrue),
    check("precio").custom((precio) =>
      paramValidate(
        precio,
        (paramName = "precio"),
        (type = "number"),
        (required = false)
      )
    ),
    validarCampos,
  ],
  crearProducto
);

//actualizar producto - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    // check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un id valido de mongo").isMongoId(),
    check("categoria").custom((id) => existeCategoriaPorIdEstadoTrue(id)),
    validarCampos,
  ],
  actualizarProducto
);

//borrar producto - privado - Admin cualquier persona con un token valido
router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN_ROLE"),
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom((id) => existeProductoPorId(id)),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
