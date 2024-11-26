const municipios = {
    "Aguascalientes": ["Aguascalientes", "Asientos", "Calvillo", "Rincón de Romos"],
    "Baja California": ["Mexicali", "Tijuana", "Ensenada", "Tecate", "Playas de Rosarito"],
    "Baja California Sur": ["La Paz", "Cabo San Lucas", "San José del Cabo", "Todos Santos"],
    "Campeche": ["Campeche", "Ciudad del Carmen", "Escárcega", "Champotón"],
    "Chiapas": ["Tuxtla Gutiérrez", "San Cristóbal de las Casas", "Tapachula", "Comitán de Domínguez"],
    "Chihuahua": ["Chihuahua", "Ciudad Juárez", "Delicias", "Parral"],
    "Coahuila": ["Saltillo", "Torreón", "Monclova", "Piedras Negras"],
    "Colima": ["Colima", "Manzanillo", "Tecomán", "Villa de Álvarez"],
    "Durango": ["Durango", "Gómez Palacio", "Lerdo", "Nuevo Ideal"],
    "Guanajuato": ["Guanajuato", "León", "Irapuato", "Celaya"],
    "Guerrero": ["Chilpancingo", "Acapulco", "Iguala", "Zihuatanejo"],
    "Hidalgo": ["Pachuca", "Tula de Allende", "Tulancingo", "Tepeji del Río"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Puerto Vallarta"],
    "Mexico": ["Toluca", "Ecatepec", "Naucalpan", "Tlalnepantla"],
    "Michoacán": ["Morelia", "Uruapan", "Lázaro Cárdenas", "Zamora"],
    "Morelos": ["Cuernavaca", "Jiutepec", "Temixco", "Yautepec"],
    "Nayarit": ["Tepic", "Bahía de Banderas", "Xalisco", "Santa María del Oro"],
    "Nuevo León": ["Monterrey", "Guadalupe", "San Nicolás", "San Pedro Garza García"],
    "Oaxaca": ["Oaxaca", "San Juan Bautista Tuxtepec", "Juchitán de Zaragoza", "Puerto Escondido"],
    "Puebla": ["Puebla", "Tehuacán", "Atlixco", "Cholula"],
    "Querétaro": ["Querétaro", "San Juan del Río", "El Marqués", "Amealco de Bonfil"],
    "Quintana Roo": ["Chetumal", "Cancún", "Playa del Carmen", "Tulum"],
    "San Luis Potosí": ["San Luis Potosí", "Ciudad Valles", "Soledad de Graciano Sánchez", "Matehuala"],
    "Sinaloa": ["Culiacán", "Mazatlán", "Los Mochis", "Guasave"],
    "Sonora": ["Hermosillo", "Nogales", "Ciudad Obregón", "San Luis Río Colorado"],
    "Tabasco": ["Villahermosa", "Cárdenas", "Comalcalco", "Teapa"],
    "Tamaulipas": ["Victoria", "Reynosa", "Matamoros", "Nuevo Laredo"],
    "Tlaxcala": ["Tlaxcala", "Apizaco", "Huamantla", "Chiautempan"],
    "Veracruz": ["Xalapa", "Veracruz", "Coatzacoalcos", "Córdoba"],
    "Yucatán": ["Mérida", "Valladolid", "Tizimín", "Progreso"],
    "Zacatecas": ["Zacatecas", "Guadalupe", "Fresnillo", "Jerez"]
  };
  
  // Función para actualizar el select de Ciudad según el estado seleccionado
  function actualizarMunicipios() {
    const estadoSeleccionado = document.getElementById("Estado").value;
    const ciudadSelect = document.getElementById("Ciudad");
  
    // Limpiar las opciones previas
    ciudadSelect.innerHTML = "<option>Seleccione una ciudad</option>";
  
    if (municipios[estadoSeleccionado]) {
      // Llenar las opciones con los municipios correspondientes
      municipios[estadoSeleccionado].forEach(function(municipio) {
        const option = document.createElement("option");
        option.textContent = municipio;
        ciudadSelect.appendChild(option);
      });
    }
  }
  
  // Función para llenar los estados en el select de Estado
  function llenarEstados() {
    const estados = Object.keys(municipios);
    const estadoSelect = document.getElementById("Estado");
  
    estados.forEach(function(estado) {
      const option = document.createElement("option");
      option.textContent = estado;
      estadoSelect.appendChild(option);
    });
  }
  
  // Espera que el DOM esté listo antes de ejecutar el código
  document.addEventListener("DOMContentLoaded", function() {
    // Llenar los estados cuando la página se carga
    llenarEstados();
  
    // Evento para actualizar los municipios cuando el estado cambia
    document.getElementById("Estado").addEventListener("change", actualizarMunicipios);
  });
  
