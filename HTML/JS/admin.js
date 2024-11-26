const API_URL = 'http://localhost:3000/api/propiedades';



// Variables globales
let propertyIdToDelete = null; // Para manejar eliminaciones con el modal

// Cargar propiedades al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('propertiesTableBody');
    const propertyForm = document.getElementById('propertyForm');

    // Verificar existencia de elementos requeridos
    if (!tableBody || !propertyForm) {
        console.error('Error: Elementos principales del DOM no encontrados.');
        return;
    }

    cargarPropiedades();
});

async function cargarPropiedades() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener las propiedades.');
        }
        const propiedades = await response.json();
        mostrarPropiedades(propiedades);
    } catch (error) {
        console.error('Error al cargar propiedades:', error); // Asegúrate de ver esto en la consola
        const propertiesSection = document.getElementById('propertiesTable');
        propertiesSection.innerHTML = '<p>Ocurrió un error al cargar las propiedades.</p>';
    }
}


// Mostrar propiedades en formato de tabla
function mostrarPropiedades(propiedades) {
    const tableBody = document.getElementById('propertiesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Limpiar la tabla

    propiedades.forEach((prop) => {
        const row = `
            <tr>
                <td>${prop.Id}</td>
                <td>${prop.Titulo}</td>
                <td>${prop.Tipo}</td>
                <td>$${prop.Precio.toLocaleString()}</td>
                <td>${prop.Ubicacion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPropiedad(${prop.Id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPropiedad(${prop.Id})">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Editar una propiedad (llenar el formulario con los datos)
async function editarPropiedad(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la propiedad.');
        }
        const prop = await response.json();
        // Llenar el formulario con los datos
        document.getElementById('propertyId').value = prop.Id;
        document.getElementById('title').value = prop.Titulo;
        document.getElementById('type').value = prop.Tipo;
        document.getElementById('price').value = prop.Precio;
        document.getElementById('location').value = prop.Ubicacion;
        document.getElementById('image').value = prop.Imagen || '';
        document.getElementById('description').value = prop.Descripcion || '';
    } catch (error) {
        console.error('Error al editar la propiedad:', error);
    }
}

// Eliminar una propiedad
async function eliminarPropiedad(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
        return;
    }

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarPropiedades(); // Recargar propiedades
    } catch (error) {
        console.error('Error al eliminar la propiedad:', error);
    }
}

// Manejo del formulario para agregar/actualizar propiedades
const propertyForm = document.getElementById('propertyForm');
if (propertyForm) {
    propertyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('propertyId').value;
        const titulo = document.getElementById('title').value;
        const tipo = document.getElementById('type').value;
        const precio = parseFloat(document.getElementById('price').value);
        const ubicacion = document.getElementById('location').value;
        const imagen = document.getElementById('image').value;
        const descripcion = document.getElementById('description').value;

        const propiedad = {
            Titulo: titulo,
            Tipo: tipo,
            Precio: isNaN(precio) ? 0 : precio,
            Ubicacion: ubicacion,
            Imagen: imagen,
            Descripcion: descripcion,
        };

        try {
            if (id) {
                // Actualizar propiedad
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(propiedad),
                });
            } else {
                // Crear propiedad
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(propiedad),
                });
            }
            propertyForm.reset(); // Limpiar el formulario
            cargarPropiedades(); // Recargar las propiedades
        } catch (error) {
            console.error('Error al guardar la propiedad:', error);
        }
    });
}
