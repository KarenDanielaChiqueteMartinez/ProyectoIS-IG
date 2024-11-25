// Función para cargar todas las propiedades desde la API
async function cargarPropiedades() {
    try {
        // Realiza una solicitud GET a la API
        const response = await fetch('http://localhost:3000/api/propiedades');
        
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        
        // Convertir la respuesta en JSON
        const propiedades = await response.json();

        // Verificar la respuesta de la API
        console.log('Propiedades cargadas:', propiedades);  // Mostrar el resultado en la consola

        // Mostrar las propiedades en el DOM
        mostrarPropiedades(propiedades);
    } catch (error) {
        console.error('Error al cargar las propiedades:', error);
        
        // Mostrar un mensaje de error en el DOM
        const propertiesSection = document.getElementById('properties');
        propertiesSection.innerHTML = '<p>Ocurrió un error al cargar las propiedades.</p>';
    }
}

// Función para mostrar las propiedades en el DOM
function mostrarPropiedades(propiedades) {
    const propertiesSection = document.getElementById('properties');
    
    // Limpiar el contenido previo
    propertiesSection.innerHTML = '';

    // Si no se encontraron propiedades, mostrar un mensaje
    if (propiedades.length === 0) {
        propertiesSection.innerHTML = '<p>No se encontraron propiedades.</p>';
        return;
    }

    // Mostrar las propiedades en tarjetas
    propiedades.forEach(prop => {
        const card = `
            <div class="property-card">
                <img src="images/${prop.Imagen || 'default.jpg'}" alt="${prop.Titulo}">
                <div class="info">
                    <h3>${prop.Titulo}</h3>
                    <p><strong>Ubicación:</strong> ${prop.Ubicacion}</p>
                    <p><strong>Precio:</strong> $${prop.Precio.toLocaleString()}</p>
                </div>
            </div>
        `;
        propertiesSection.innerHTML += card;
    });
}

// Función para aplicar filtros de búsqueda
async function aplicarFiltros() {
    // Obtener los valores de los filtros
    const search = document.getElementById('search').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const price = document.getElementById('filter-price').value;

    try {
        // URL base para la API
        let url = 'http://localhost:3000/api/propiedades';

        // Crear un objeto URLSearchParams para manejar los parámetros de consulta
        const params = new URLSearchParams();

        // Agregar los filtros a los parámetros si están presentes
        if (search) params.append('ubicacion', search);
        if (type) params.append('tipo', type);
        if (price) params.append('precio', price);

        // Si hay parámetros de consulta, añadirlos a la URL
        if ([...params].length > 0) {
            url += `?${params.toString()}`;
        }

        // Realizar la solicitud GET a la API con los filtros
        const response = await fetch(url);
        
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }

        // Obtener las propiedades filtradas en formato JSON
        const propiedades = await response.json();

        // Verificar la respuesta de la API después de aplicar filtros
        console.log('Propiedades filtradas:', propiedades);  // Mostrar el resultado en la consola
        
        // Mostrar las propiedades filtradas en el DOM
        mostrarPropiedades(propiedades);
    } catch (error) {
        console.error('Error al aplicar filtros:', error);
        
        // Mostrar un mensaje de error en el DOM
        const propertiesSection = document.getElementById('properties');
        propertiesSection.innerHTML = '<p>Ocurrió un error al aplicar los filtros.</p>';
    }
}

// Cargar propiedades cuando la página se carga
window.onload = cargarPropiedades;
