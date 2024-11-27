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

// Función para cargar propiedades desde la API
async function cargarPropiedades() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al obtener las propiedades.');
        }
        const propiedades = await response.json();
        mostrarPropiedades(propiedades);
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
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
                <td>${prop.Operacion}</td>
                <td>$${prop.PrecioVenta || prop.PrecioRenta || 'N/A'}</td>
                <td>${prop.Ciudad}, ${prop.Estado}</td>
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

        // Llenar el formulario con los datos de la propiedad
        document.getElementById('propertyId').value = prop.Id;
        document.getElementById('title').value = prop.Titulo;
        document.getElementById('type').value = prop.Tipo;
        document.getElementById('operation').value = prop.Operacion;
        document.getElementById('priceSale').value = prop.PrecioVenta || '';
        document.getElementById('priceRent').value = prop.PrecioRenta || '';
        document.getElementById('city').value = prop.Ciudad;
        document.getElementById('state').value = prop.Estado;
        document.getElementById('latitude').value = prop.Latitud || '';
        document.getElementById('longitude').value = prop.Longitud || '';
        // Repite para otros campos según el formulario
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
        const propiedad = {
            Titulo: document.getElementById('title').value,
            Tipo: document.getElementById('type').value,
            Operacion: document.getElementById('operation').value,
            PrecioVenta: parseFloat(document.getElementById('priceSale').value) || null,
            PrecioRenta: parseFloat(document.getElementById('priceRent').value) || null,
            Ciudad: document.getElementById('city').value,
            Estado: document.getElementById('state').value,
            Latitud: parseFloat(document.getElementById('latitude').value) || null,
            Longitud: parseFloat(document.getElementById('longitude').value) || null,
            // Agrega más campos según sea necesario
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
