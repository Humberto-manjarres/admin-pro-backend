const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config.js');
const cors = require('cors');

//Crear servidor de express
const app = express();

/* Middleware */
//Configurar CORS
app.use(cors());

/* Middleware */
//captura y paseo del body
app.use(express.json());

// Base de datos
dbConnection();


/* Middleware */
//Rutas
/* el código --> "require('./routes/usuarios')" --> es donde está el controlador de usuario */
app.use('/api/usuarios', require('./routes/usuarios'));

/* el código --> "require('./routes/auth')" --> es donde está el controlador del login */
app.use('/api/login', require('./routes/auth'));


/* escuchando por el puerto que está configurado en los environment */
app.listen(process.env.PORT, ()=> {
    console.log('servidor corriendo en puerto ',process.env.PORT);
})