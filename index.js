const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config.js');
const cors = require('cors');

//Crear servidor de express
const app = express();

/* Middleware */
//Configurar CORS
app.use(cors());

//Carpeta Publica
app.use( express.static('public'));

/* Middleware */
//captura y paseo del body
app.use(express.json());

// Base de datos
dbConnection();


/* Middleware */
//Rutas
/* el código --> "require('./routes/usuarios')" --> es donde está el controlador de usuario */
app.use('/api/usuarios', require('./routes/usuarios'));

app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));

/* el código --> "require('./routes/auth')" --> es donde está el controlador del login */
app.use('/api/login', require('./routes/auth'));

app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));


/* escuchando por el puerto que está configurado en los environment */
app.listen(process.env.PORT, ()=> {
    console.log('servidor corriendo en puerto ',process.env.PORT);
})