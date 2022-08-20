const express = require("express");
var cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias'
    }
    
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
    this.app.use(this.path.auth, require('../routes/auth'));
    this.app.use(this.path.usuarios, require('../routes/usuarios'));
    this.app.use(this.path.categorias, require('../routes/categorias'));  
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
