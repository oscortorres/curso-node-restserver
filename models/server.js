const express = require("express");
var cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      buscar: "/api/buscar",
      uploads: "/api/uploads",
    };

    //conectar a base de datos
    this.conectarBD();

    // Middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();
  }

  async conectarBD() {
    await dbConnection();
  }

  middlewares() {
    // cors
    this.app.use(cors());
    // parseo y lectura del body
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static("public"));

    // uploads - carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true
      })
    );
  }

  routes() {
    this.app.use(this.path.auth, require("../routes/auth"));
    this.app.use(this.path.usuarios, require("../routes/usuarios"));
    this.app.use(this.path.categorias, require("../routes/categorias"));
    this.app.use(this.path.productos, require("../routes/productos"));
    this.app.use(this.path.buscar, require("../routes/buscar"));
    this.app.use(this.path.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
