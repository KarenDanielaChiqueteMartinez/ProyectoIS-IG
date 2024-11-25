const API_URL = 'http://localhost:3000/api/propiedades';

// Cargar propiedades al iniciar la página
document.addEventListener('DOMContentLoaded', cargarPropiedades);

// Obtener el formulario y manejar el evento de envío
const propertyForm = document.getElementById('propertyForm');
propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('propertyId').value;
    const titulo = document.getElementById('title').value;
    const tipo = document.getElementById('type').value;
    const precio = document.getElementById('price').value;
    const ubicacion = document.getElementById('location').value;
    const imagen = document.getElementById('image').value;
    const descripcion = document.getElementById('description').value;

    const propiedad = { Titulo: titulo, Tipo: tipo, Precio: precio, Ubicacion: ubicacion, Imagen: imagen, Descripcion: descripcion };

    try {
        if (id) {
            // Actualizar propiedad
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propiedad)
            });
            alert('Propiedad actualizada con éxito');
        } else {
            // Crear propiedad
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propiedad)
            });
            alert('Propiedad creada con éxito');
        }
    } catch (error) {
        console.error('Error al procesar la propiedad:', error);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }

    propertyForm.reset();
    cargarPropiedades();
});

// Cargar propiedades desde la API
async function cargarPropiedades() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar propiedades');
        }

        const propiedades = await response.json();
        const tbody = document.querySelector('#propertiesTable tbody');
        tbody.innerHTML = '';

        propiedades.forEach((prop) => {
            const row = `
                <tr>
                    <td>${prop.Id}</td>
                    <td>${prop.Titulo}</td>
                    <td>${prop.Tipo}</td>
                    <td>$${prop.Precio.toLocaleString()}</td>
                    <td>${prop.Ubicacion}</td>
                    <td>
                        <button onclick="editarPropiedad(${prop.Id})">Editar</button>
                        <button onclick="eliminarPropiedad(${prop.Id})" style="background-color: red;">Eliminar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al cargar propiedades:', error);
        const tbody = document.querySelector('#propertiesTable tbody');
        tbody.innerHTML = '<tr><td colspan="6">Ocurrió un error al cargar las propiedades.</td></tr>';
    }
}

// Editar una propiedad (llenar el formulario con los datos)
async function editarPropiedad(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener propiedad');
        }

        const prop = await response.json();
        document.getElementById('propertyId').value = prop.Id;
        document.getElementById('title').value = prop.Titulo;
        document.getElementById('type').value = prop.Tipo;
        document.getElementById('price').value = prop.Precio;
        document.getElementById('location').value = prop.Ubicacion;
        document.getElementById('image').value = prop.Imagen;
        document.getElementById('description').value = prop.Descripcion;
    } catch (error) {
        console.error('Error al editar la propiedad:', error);
        alert('No se pudo cargar la propiedad para editar.');
    }
}

// Eliminar una propiedad
async function eliminarPropiedad(id) {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta propiedad?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Error al eliminar propiedad');
        }

        alert('Propiedad eliminada con éxito');
        cargarPropiedades();
    } catch (error) {
        console.error('Error al eliminar la propiedad:', error);
        alert('No se pudo eliminar la propiedad. Por favor, inténtalo de nuevo.');
    }
}
