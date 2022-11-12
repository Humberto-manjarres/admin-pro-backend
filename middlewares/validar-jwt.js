const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response , next) => {
    
    /* leer el Token */    
    const tokenHeader = req.header('x-token');
    if (!tokenHeader) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay Token en la petición'
        })
    }

    try {
        const { uid } = jwt.verify(tokenHeader, process.env.JWT_SECRET);
        
        /* seteando información en la request, es decir, la request tendrá un nuevo elemento llamado uid */
        req.uid = uid;

        next();    
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es valido!'
        })
    }

}

module.exports = {
    validarJWT
}