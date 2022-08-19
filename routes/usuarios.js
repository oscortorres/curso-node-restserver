const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole  
} = require('../middlewares');

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom((id) => existeUsuarioPorId(id)),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    // check("correo", "El correo no es valido").isEmail(),
    check("correo").custom((correo) => emailExiste(correo)),
    check("password", "El password debe tener más de 6 letras").isLength({
      min: 6,
    }),
    // check("rol", "No es un rol válido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // es un check personalizado
    // check('rol').custom( esRoleValido),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom((id) => existeUsuarioPorId(id)),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
