
// Función para manejar el formulario
document.getElementById('addPropertyForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const form = event.target;
    const data = {
        Titulo: form.titulo.value,
        Tipo: form.tipo.value,
        Operacion: form.operacion.value,
        Precio: form.precio.value,
        Imagen: form.imagen.value || 'default.jpg',  // Asignar valor por defecto
        Descripcion: form.descripcion.value,
        FechaCreacion: form.fechaCreacion.value,
        PrecioVenta: form.precioVenta.value || null,
        PrecioRenta: form.precioRenta.value || null,
        AreaConstruida: form.areaConstruida.value || null,
        AreaTotal: form.areaTotal.value || null,
        Cuartos: form.cuartos.value || 0,
        Banos: form.banos.value || 0,
        Pisos: form.pisos.value || 0,
        Direccion: form.direccion.value,
        Ciudad: form.ciudad.value,
        Estado: form.estado.value,
        Pais: form.pais.value,
        CodigoPostal: form.codigoPostal.value,
        Latitud: form.latitud.value || null,
        Longitud: form.longitud.value || null
    };

    // Enviar la solicitud a la API
    try {
        const response = await fetch('http://localhost:3000/api/propiedades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);  // Muestra el mensaje de éxito
        } else {
            alert('Error al agregar la propiedad: ' + result.error);  // Muestra el error si falla
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al intentar agregar la propiedad.');
    }
});
