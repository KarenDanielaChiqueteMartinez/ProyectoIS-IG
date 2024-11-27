const express = require('express');
const sql = require('mssql');
const cors = require('cors');

// Inicializa Express
const app = express();

// Configuración de la base de datos
const config = {
    user: 'MiUsuario', // Cambia por tu usuario de SQL Server
    password: 'MiContraseñaSegura', // Cambia por tu contraseña
    server: 'localhost', // Cambia si no estás trabajando en localhost
    port: 1433,
    database: 'Inmobiliaria', // Cambia por el nombre de tu base de datos
    options: {
        encrypt: false, // Cambia a true si usas Azure
        trustServerCertificate: true, // Necesario para evitar errores con certificados locales
    },
};

// Middleware para habilitar CORS (antes de las rutas y middleware específicos)
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Cambia por la URL donde está tu frontend
}));

// Middleware para analizar JSON en solicitudes
app.use(express.json());

// Conexión a la base de datos
async function connectToDB() {
    try {
        return await sql.connect(config);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}

// **Rutas para CRUD de propiedades**

// Obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const pool = await connectToDB();
        const result = await pool.request().query('SELECT * FROM Propiedades');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener propiedades:', err);
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
});

// Obtener una propiedad por ID
app.get('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connectToDB();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Propiedades WHERE Id = @id');
        if (result.recordset.length === 0) {
            res.status(404).json({ error: 'Propiedad no encontrada' });
        } else {
            res.json(result.recordset[0]);
        }
    } catch (err) {
        console.error('Error al obtener la propiedad:', err);
        res.status(500).json({ error: 'Error al obtener la propiedad' });
    }
});

// Crear una nueva propiedad
app.post('/api/propiedades', async (req, res) => {
    console.log('Datos recibidos:', req.body); // Esto te permitirá ver qué datos llegan
    const {
        Titulo, Tipo, Operacion, PrecioVenta, PrecioRenta, AreaConstruida, AreaTotal,
        Cuartos, Banos, Pisos, Direccion, Ciudad, Estado, Pais, CodigoPostal, Latitud, Longitud,
        Imagen, Descripcion
    } = req.body;

    try {
        const pool = await connectToDB();
        await pool.request()
            .input('Titulo', sql.VarChar, Titulo)
            .input('Tipo', sql.VarChar, Tipo)
            .input('Operacion', sql.VarChar, Operacion)
            .input('PrecioVenta', sql.Money, PrecioVenta)
            .input('PrecioRenta', sql.Money, PrecioRenta)
            .input('AreaConstruida', sql.Int, AreaConstruida)
            .input('AreaTotal', sql.Int, AreaTotal)
            .input('Cuartos', sql.Int, Cuartos)
            .input('Banos', sql.Int, Banos)
            .input('Pisos', sql.Int, Pisos)
            .input('Direccion', sql.VarChar, Direccion)
            .input('Ciudad', sql.VarChar, Ciudad)
            .input('Estado', sql.VarChar, Estado)
            .input('Pais', sql.VarChar, Pais)
            .input('CodigoPostal', sql.VarChar, CodigoPostal)
            .input('Latitud', sql.Float, Latitud)
            .input('Longitud', sql.Float, Longitud)
            .input('Imagen', sql.VarChar, Imagen)
            .input('Descripcion', sql.Text, Descripcion)
            .query(`
                INSERT INTO Propiedades (
                    Titulo, Tipo, Operacion, PrecioVenta, PrecioRenta, AreaConstruida, AreaTotal,
                    Cuartos, Banos, Pisos, Direccion, Ciudad, Estado, Pais, CodigoPostal, Latitud, Longitud,
                    Imagen, Descripcion
                )
                VALUES (
                    @Titulo, @Tipo, @Operacion, @PrecioVenta, @PrecioRenta, @AreaConstruida, @AreaTotal,
                    @Cuartos, @Banos, @Pisos, @Direccion, @Ciudad, @Estado, @Pais, @CodigoPostal, @Latitud, @Longitud,
                    @Imagen, @Descripcion
                )
            `);
        res.status(201).json({ message: 'Propiedad creada exitosamente' });
    } catch (err) {
        console.error('Error al crear la propiedad:', err);
        res.status(500).json({ error: 'Error al crear la propiedad' });
    }
});

// Actualizar una propiedad existente
app.put('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    const {
        Titulo, Tipo, Operacion, PrecioVenta, PrecioRenta, AreaConstruida, AreaTotal,
        Cuartos, Banos, Pisos, Direccion, Ciudad, Estado, Pais, CodigoPostal, Latitud, Longitud,
        Imagen, Descripcion
    } = req.body;

    try {
        const pool = await connectToDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('Titulo', sql.VarChar, Titulo)
            .input('Tipo', sql.VarChar, Tipo)
            .input('Operacion', sql.VarChar, Operacion)
            .input('PrecioVenta', sql.Money, PrecioVenta)
            .input('PrecioRenta', sql.Money, PrecioRenta)
            .input('AreaConstruida', sql.Int, AreaConstruida)
            .input('AreaTotal', sql.Int, AreaTotal)
            .input('Cuartos', sql.Int, Cuartos)
            .input('Banos', sql.Int, Banos)
            .input('Pisos', sql.Int, Pisos)
            .input('Direccion', sql.VarChar, Direccion)
            .input('Ciudad', sql.VarChar, Ciudad)
            .input('Estado', sql.VarChar, Estado)
            .input('Pais', sql.VarChar, Pais)
            .input('CodigoPostal', sql.VarChar, CodigoPostal)
            .input('Latitud', sql.Float, Latitud)
            .input('Longitud', sql.Float, Longitud)
            .input('Imagen', sql.VarChar, Imagen)
            .input('Descripcion', sql.Text, Descripcion)
            .query(`
                UPDATE Propiedades
                SET Titulo = @Titulo, Tipo = @Tipo, Operacion = @Operacion, 
                    PrecioVenta = @PrecioVenta, PrecioRenta = @PrecioRenta, 
                    AreaConstruida = @AreaConstruida, AreaTotal = @AreaTotal, 
                    Cuartos = @Cuartos, Banos = @Banos, Pisos = @Pisos, 
                    Direccion = @Direccion, Ciudad = @Ciudad, Estado = @Estado, 
                    Pais = @Pais, CodigoPostal = @CodigoPostal, Latitud = @Latitud, 
                    Longitud = @Longitud, Imagen = @Imagen, Descripcion = @Descripcion
                WHERE Id = @id
            `);
        res.json({ message: 'Propiedad actualizada exitosamente' });
    } catch (err) {
        console.error('Error al actualizar la propiedad:', err);
        res.status(500).json({ error: 'Error al actualizar la propiedad' });
    }
});

// Eliminar una propiedad
app.delete('/api/propiedades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connectToDB();
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Propiedades WHERE Id = @id');
        res.json({ message: 'Propiedad eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar la propiedad:', err);
        res.status(500).json({ error: 'Error al eliminar la propiedad' });
    }
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});