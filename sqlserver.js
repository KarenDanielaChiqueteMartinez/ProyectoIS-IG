const express = require('express');
const sql = require('mssql');
const cors = require('cors'); // Importar el paquete CORS

const app = express();
const port = 3000;

// Middleware para manejar JSON y habilitar CORS
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Cambia esta URL si es necesario, es la dirección del Front-End
}));

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

// Ruta para obtener todas las propiedades con paginación
app.get('/api/propiedades', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  // Parámetros de página y límite
    const offset = (page - 1) * limit; // Calcular el desplazamiento para la paginación

    try {
        const result = await sql.query(`
            SELECT * FROM Propiedades
            ORDER BY Id
            OFFSET ${offset} ROWS
            FETCH NEXT ${limit} ROWS ONLY
        `);

        res.json(result.recordset);  // Devuelve las propiedades paginadas
    } catch (err) {
        res.status(500).send('Error al obtener propiedades: ' + err.message);
    }
});

// Ruta para obtener una propiedad por ID
app.get('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Propiedades WHERE Id = ${id}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]); // Devuelve la propiedad específica
        } else {
            res.status(404).send('Propiedad no encontrada');
        }
    } catch (err) {
        res.status(500).send('Error al obtener la propiedad: ' + err.message);
    }
});

// Ruta para crear una nueva propiedad
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

// Ruta para actualizar una propiedad por ID
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

// Ruta para eliminar una propiedad por ID
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
