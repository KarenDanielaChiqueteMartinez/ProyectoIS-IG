const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Configuración de conexión a SQL Server
const config = {
    server: 'localhost',
    port: 1433, // Cambia si es necesario
    database: 'Inmobiliaria',
    user: 'MiUsuario', // Usuario creado en SQL Server
    password: 'MiContraseñaSegura', // Contraseña
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

// Conectar a SQL Server
sql.connect(config)
    .then(() => console.log('Conexión a SQL Server exitosa'))
    .catch(err => console.error('Error al conectar a SQL Server:', err));

// Obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Propiedades');
        res.json(result.recordset); // Devuelve las propiedades en formato JSON
    } catch (err) {
        res.status(500).send('Error al obtener propiedades: ' + err.message);
    }
});

// Obtener una propiedad por ID
app.get('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Propiedades WHERE Id = ${id}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Devuelve una propiedad específica
        } else {
            res.status(404).send('Propiedad no encontrada');
        }
    } catch (err) {
        res.status(500).send('Error al obtener la propiedad: ' + err.message);
    }
});

// Crear una nueva propiedad
app.post('/api/propiedades', async (req, res) => {
    const { Titulo, Tipo, Precio, Ubicacion, Imagen, Descripcion } = req.body;
    try {
        const result = await sql.query`
            INSERT INTO Propiedades (Titulo, Tipo, Precio, Ubicacion, Imagen, Descripcion)
            VALUES (${Titulo}, ${Tipo}, ${Precio}, ${Ubicacion}, ${Imagen}, ${Descripcion});
        `;
        res.status(201).send('Propiedad agregada exitosamente');
    } catch (err) {
        res.status(500).send('Error al agregar propiedad: ' + err.message);
    }
});

// Actualizar una propiedad por ID
app.put('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    const { Titulo, Tipo, Precio, Ubicacion, Imagen, Descripcion } = req.body;
    try {
        const result = await sql.query`
            UPDATE Propiedades
            SET Titulo = ${Titulo}, Tipo = ${Tipo}, Precio = ${Precio}, Ubicacion = ${Ubicacion}, Imagen = ${Imagen}, Descripcion = ${Descripcion}
            WHERE Id = ${id};
        `;
        if (result.rowsAffected[0] > 0) {
            res.send('Propiedad actualizada correctamente');
        } else {
            res.status(404).send('Propiedad no encontrada');
        }
    } catch (err) {
        res.status(500).send('Error al actualizar propiedad: ' + err.message);
    }
});

// Eliminar una propiedad por ID
app.delete('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`
            DELETE FROM Propiedades WHERE Id = ${id};
        `;
        if (result.rowsAffected[0] > 0) {
            res.send('Propiedad eliminada correctamente');
        } else {
            res.status(404).send('Propiedad no encontrada');
        }
    } catch (err) {
        res.status(500).send('Error al eliminar propiedad: ' + err.message);
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

