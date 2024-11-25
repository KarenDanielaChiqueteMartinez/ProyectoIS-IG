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

    if (id) {
        // Actualizar propiedad
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propiedad)
        });
    } else {
        // Crear propiedad
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propiedad)
        });
    }

    propertyForm.reset();
    cargarPropiedades();
});

// Cargar propiedades desde la API
async function cargarPropiedades() {
    const response = await fetch(API_URL);
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
}

// Editar una propiedad (llenar el formulario con los datos)
async function editarPropiedad(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const prop = await response.json();

    document.getElementById('propertyId').value = prop.Id;
    document.getElementById('title').value = prop.Titulo;
    document.getElementById('type').value = prop.Tipo;
    document.getElementById('price').value = prop.Precio;
    document.getElementById('location').value = prop.Ubicacion;
    document.getElementById('image').value = prop.Imagen;
    document.getElementById('description').value = prop.Descripcion;
}

// Eliminar una propiedad
async function eliminarPropiedad(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarPropiedades();
}
