const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config.js');
const cors = require('cors');

//Crear servidoe de express
const app = express();

//Configurar CORS
app.use(cors());

// Base de datos
dbConnection();



//Rutas
app.get('/', (req,res)=>{
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
})

app.listen(process.env.PORT, ()=> {
    console.log('servidor corriendo en puerto ',process.env.PORT);
})