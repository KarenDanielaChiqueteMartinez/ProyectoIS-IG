const API_URL = 'http://localhost:3000/api/propiedades';

// Cargar propiedades al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarPropiedades();

    // Configurar el evento del formulario para agregar propiedad
    const form = document.getElementById('addPropertyForm');
    if (form) {
        form.addEventListener('submit', agregarPropiedad);
    }
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
        console.error('Error al cargar propiedades:', error);
        const tableBody = document.getElementById('propertiesTableBody');
        tableBody.innerHTML = '<tr><td colspan="8">Error al cargar las propiedades. Intenta nuevamente.</td></tr>';
    }
}

// Mostrar las propiedades en la tabla
function mostrarPropiedades(propiedades) {
    const tableBody = document.getElementById('propertiesTableBody');
    tableBody.innerHTML = ''; // Limpiar el contenido anterior

    propiedades.forEach((prop) => {
        const row = `
            <tr>
                <td>${prop.Id}</td>
                <td>${prop.Titulo || 'N/A'}</td>
                <td>${prop.Tipo || 'N/A'}</td>
                <td>${prop.Operacion || 'N/A'}</td>
                <td>${prop.FechaPublicacion || 'No registrada'}</td>
                <td>${prop.FechaExpiracion || 'No registrada'}</td>
                <td>${prop.Precio || 'No disponible'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarPropiedad(${prop.Id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPropiedad(${prop.Id})">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Función para redirigir a la página de edición
function editarPropiedad(id) {
    // Redirige al formulario de edición con el ID de la propiedad en la URL
    window.location.href = `1editar-propiedad.html?id=${id}`;
}

// Función para eliminar propiedad
async function eliminarPropiedad(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Error al eliminar la propiedad.');
            }
            alert('Propiedad eliminada exitosamente');
            cargarPropiedades(); // Recargar la lista de propiedades
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            alert('No se pudo eliminar la propiedad. Intenta nuevamente.');
        }
    }
}

// Agregar una nueva propiedad
async function agregarPropiedad(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores del formulario
    const form = event.target;
    const data = {
        Titulo: form.titulo.value,
        Tipo: form.tipoPropiedad.value,
        Operacion: form.operacion.value,
        PrecioVenta: form.precioVenta.value || null,
        PrecioRenta: form.precioRenta.value || null,
        Precio: form.precioVenta.value || form.precioRenta.value || null, // Usar precioVenta o precioRenta según la operación
        AreaConstruida: form.areaConstruida.value || null,
        AreaTotal: form.areaTotal.value || null,
        Cuartos: form.Cuartos.value || 0,
        Banos: form.Banos.value || 0,
        Pisos: form.Pisos.value || 0,
        SalaEstar: form.SalaEstar.value || 0,
        Cocina: form.Cocina.value || 0,
        EstudioOficina: form.EstudioOficina.value || 0,
        Comedor: form.Comedor.value || 0,
        CuartoLavado: form.CuartoLavado.value || 0,
        CuartoServicio: form.CuartoServicio.value || 0,
        VestibuloRecibidor: form.VesitibuloRecibidor.value || 0,
        Jardin: form.Jardin.value || 0,
        Terraza: form.Terraza.value || 0,
        Balcon: form.Balcon.value || 0,
        Piscina: form.Piscina.value || 0,
        Gimnasio: form.Gimnasio.value || 0,
        SpaOSauna: form.SpaOSauna.value || 0,
        RoofGarden: form.RoofGarden.value || 0,
        AreaMascotas: form.AreaMascotas.value || 0,
        CanchaDeportiva: form.canchaDeportiva.value || 0,
        AreaJuegos: form.AreaJuegos.value || 0,
        CanchaTenis: form.CanchaTenis.value || 0,
        Direccion: form.direccion.value,
        Ciudad: form.ciudad.value,
        Estado: form.estado.value,
        Pais: form.pais.value,
        CodigoPostal: form.codigoPostal.value,
        Latitud: form.latitud.value || null,
        Longitud: form.longitud.value || null,
        Imagen: 'default.jpg', // Este campo se puede gestionar mejor con Dropzone
        Descripcion: form.descripcion.value,
    };

    try {
        // Realizar solicitud POST para agregar la propiedad
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al agregar la propiedad.');
        }

        alert('Propiedad agregada exitosamente');
        form.reset(); // Limpiar el formulario
        cargarPropiedades(); // Recargar la lista de propiedades
    } catch (error) {
        console.error('Error al agregar propiedad:', error);
        alert('No se pudo agregar la propiedad. Intenta nuevamente.');
    }
}

