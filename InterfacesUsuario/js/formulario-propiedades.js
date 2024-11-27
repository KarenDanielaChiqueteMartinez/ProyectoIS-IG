function controlarPrecio() {
    const operacion = document.getElementById('operacion').value;
    const precioVenta = document.getElementById('precioVenta');
    const precioRenta = document.getElementById('precioRenta');

    if (operacion === 'venta') {
        precioVenta.disabled = false;
        precioRenta.disabled = true;
        precioRenta.value = '';
    } else if (operacion === 'renta') {
        precioRenta.disabled = false;
        precioVenta.disabled = true;
        precioVenta.value = '';
    } else {
        precioVenta.disabled = true;
        precioRenta.disabled = true;
    }
}

// Genera campos con contadores dinámicos para áreas
function crearCamposContadores(titulos) {
    return titulos.map((titulo) => `
        <div class="col-md-4 mb-3">
            <label class="form-label">${titulo}</label>
            <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" onclick="cambiarValor('${titulo}', -1)">-</button>
                <input type="number" id="${titulo.replace(/\s/g, '')}" class="form-control text-center" value="0" min="0" onchange="generarCamposImagenes()">
                <button class="btn btn-outline-secondary" type="button" onclick="cambiarValor('${titulo}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

// Cambia el valor del contador
function cambiarValor(id, cambio) {
    const input = document.getElementById(id.replace(/\s/g, ''));
    let valorActual = parseInt(input.value) || 0;
    valorActual = Math.max(0, valorActual + cambio);
    input.value = valorActual;
}

// Genera los campos de carga de imágenes usando Dropzone
function generarCamposImagenes() {
    const cuartos = parseInt(document.getElementById('Cuartos').value) || 0;
    const baños = parseInt(document.getElementById('Baños').value) || 0;
    const cocinas = parseInt(document.getElementById('Cocina').value) || 0;

    const contenedorImagenes = document.getElementById('imagenes-container');
    contenedorImagenes.innerHTML = '';

    function agregarCampos(area, cantidad) {
        for (let i = 1; i <= cantidad; i++) {
            const areaDiv = document.createElement('div');
            areaDiv.classList.add('col-md-4', 'mb-3');
            areaDiv.innerHTML = `
                <label class="form-label">Fotos del ${area} ${i}</label>
                <div class="dropzone" id="dropzone-${area}${i}">
                    <div class="dz-message">Arrastra y suelta las fotos aquí o haz clic para seleccionarlas.</div>
                </div>
            `;
            contenedorImagenes.appendChild(areaDiv);

            new Dropzone(`#dropzone-${area}${i}`, {
                url: '/upload',
                maxFiles: 3,
                acceptedFiles: 'image/*',
                dictDefaultMessage: 'Arrastra tus fotos aquí o haz clic para seleccionarlas',
                dictFallbackMessage: 'Tu navegador no soporta la carga de archivos por arrastre',
                dictInvalidFileType: 'Solo se permiten archivos de imagen',
                dictFileTooBig: 'El archivo es demasiado grande. Tamaño máximo: 2 MB',
                maxFilesize: 2,
                addRemoveLinks: true,
            });
        }
    }

    if (cuartos > 0) agregarCampos('Cuarto', cuartos);
    if (baños > 0) agregarCampos('Baño', baños);
    if (cocinas > 0) agregarCampos('Cocina', cocinas);
}

// Inicializa el mapa para seleccionar ubicación
function inicializarMapa() {
    const coordenadasIniciales = [19.432608, -99.133209]; // Ciudad de México
    const zoomInicial = 13;

    const map = L.map('map').setView(coordenadasIniciales, zoomInicial);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(coordenadasIniciales, { draggable: true }).addTo(map);

    marker.on('dragend', function () {
        const posicion = marker.getLatLng();
        document.getElementById('latitud').value = posicion.lat;
        document.getElementById('longitud').value = posicion.lng;
    });

    map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        document.getElementById('latitud').value = lat;
        document.getElementById('longitud').value = lng;
    });

    document.getElementById('latitud').value = coordenadasIniciales[0];
    document.getElementById('longitud').value = coordenadasIniciales[1];
}

// Llamar a la función para inicializar el mapa cuando la página cargue
document.addEventListener('DOMContentLoaded', function () {
    inicializarMapa();
    controlarPrecio(); // Para manejar el estado inicial de los campos de precio
});
