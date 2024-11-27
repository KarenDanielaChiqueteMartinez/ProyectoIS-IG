const express = require('express');
const dotenv = require('dotenv');
const config = require('./config/database'); 
const sql = require('mssql'); 
const generateAuthToken = require('./services/auth.service'); 


// Carga de variables de entorno
dotenv.config();

// Conexión a la base de datos
sql.connect(config).then(() => console.log("Conexion existosa con la base de datos")).catch(error => console.log(error)); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.post("/login", (req, res) => {
    const { email, password} = req.body;
    if (!email  || !password){
        return res.status(400).json({ok: false, message: "Email y contraseña son requeridos"});
    }

    const query = `SELECT * FROM users WHERE Correo = '${email}' AND Contraseña = '${password}'`;
    sql.query(query, (error, result) => {
        if (error) {
            return res.status(500).json({ok: false, message: "Interal server error"}); 
            console.log(error); 
        }

        if (result.recordset.length === 0){
            return res.status(404).json({ok: false, message: "Usuario no encontrado"}); 
        }
        
        const token = generateAuthToken(email); 
        return res.status(200).json({ok: true, token}); 

    })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});