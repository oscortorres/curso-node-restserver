const express = require("express");
var cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.usuariosPath = '/api/usuarios';
    this.authPath = '/api/auth';

    //conectar a base de datos
    this.conectarBD();


    // Middlewares
    this.middlewares();

    // rutas de mi aplicacion
    this.routes();
  }

  async conectarBD(){
    await dbConnection();
  }

  middlewares() {
    // cors
    this.app.use( cors());
    // parseo y lectura del body
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require('../routes/auth'));
    this.app.use(this.usuariosPath, require('../routes/usuarios'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
