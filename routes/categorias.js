const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria
} = require("../controllers/categorias");

const { existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, tieneRole } = require("../middlewares");

const router = Router();

// {{url}}/api/categorias

//obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom((id) => existeCategoriaPorId(id)),
    validarCampos,
  ],
  obtenerCategoria
);

//crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//actualizar categoria - privado - cualquier persona con un token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un id valido de mongo").isMongoId(),
    check("id").custom((id) => existeCategoriaPorId(id)),
    validarCampos,
  ],
  actualizarCategoria
);

//borrar categoria - privado - Admin cualquier persona con un token valido
router.delete(
    "/:id",
    [
      validarJWT,
      tieneRole('ADMIN_ROLE'),
      check("id", "No es un id valido de mongo").isMongoId(),
      check("id").custom((id) => existeCategoriaPorId(id)),
      validarCampos,
    ],
    borrarCategoria
  );
// router.post("/login", [
//     check("correo", "El nombre es obligatorio").isEmail(),
//     check("password", "La contraseña es obligatoria").not().isEmpty(),
//     validarCampos,
// ], login);

module.exports = router;
