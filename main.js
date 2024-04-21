// Variables globales para almacenar los datos procesados y poder reutilizarlos
let datosProcesados;
async function cargarDatos() {
    const response = await fetch('encuesta_dh_filtrada.csv');
    const csvText = await response.text();
    const data = csvToArray(csvText, ',');

    // Procesa y agrega la edad convertida en número a cada objeto
    datosProcesados = data.map(d => ({
        respuesta: d["¿Qué son para ti los Derechos Humanos?"],
        edad: parseFloat(d["¿Cuántos años cumplidos tienes? (anota el número)"]),
        radius: Math.sqrt(d["¿Qué son para ti los Derechos Humanos?"].length) * 2,
        color: 'gray' // Color por defecto, se asignará según el botón pulsado
    }));

    // Visualizar todos los datos al inicio
    actualizarVisualizacion('menores10');
}

// Función para convertir CSV a array de objetos
function csvToArray(str, delimiter = ",") {
    const lines = str.split("\n");
    const headers = lines[0].split(delimiter).map(header => header.trim());
    const arr = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(cell => cell.trim());
        return headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
    });
    return arr.filter(row => row[headers[0]]); // Filtrar filas vacías
}

function actualizarVisualizacion(rangoEdad) {
    // Filtra los datos según el rango de edad seleccionado
    let datosFiltrados;
    if (rangoEdad === 'menores10') {
        datosFiltrados = datosProcesados.filter(d => d.edad <= 10);
    } else if (rangoEdad === 'entre10y15') {
        datosFiltrados = datosProcesados.filter(d => d.edad > 10 && d.edad < 15);
    } else if (rangoEdad === 'mayores15') {
        datosFiltrados = datosProcesados.filter(d => d.edad >= 15);
    } else {
        datosFiltrados = datosProcesados; // Todos los datos
    }

    // Configuración inicial
    const width = window.innerWidth;
    const height = window.innerHeight;


    // Seleccione el SVG existente o cree uno nuevo si es necesario
    let svg = d3.select('#viz').select('svg');
    if (svg.empty()) {
        svg = d3.select('#viz').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('border', '1px solid black'); // Solo para visualizar el borde del SVG
    }

    // Crear la simulación de fuerzas para las burbujas
    // Restablecer la simulación con los nuevos datos filtrados
    const simulation = d3.forceSimulation(datosFiltrados)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius));

    // Función para generar un color aleatorio
    function colorAleatorio() {
        return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    // Enlazar los datos filtrados con la selección de burbujas
    const bubbles = svg.selectAll('.bubble').data(datosFiltrados, d => d.respuesta);

    // Eliminar las burbujas que ya no están en los datos filtrados
    bubbles.exit().remove();

    // Crear nuevas burbujas y fusionar con las existentes
    bubbles.enter().append('circle')
        .attr('class', 'bubble')
        .merge(bubbles)
        .attr('r', d => d.radius)
        .attr('fill', colorAleatorio) // Asignar un color aleatorio a cada burbuja
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Funciones para manejar los eventos de arrastre
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    simulation.nodes(datosFiltrados).on('tick', ticked);

    function ticked() {
        svg.selectAll('.bubble')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }
}

cargarDatos();

document.getElementById('btnMenores10').addEventListener('click', () => actualizarVisualizacion('menores10'));
document.getElementById('btnEntre10y15').addEventListener('click', () => actualizarVisualizacion('entre10y15'));
document.getElementById('btnMayores15').addEventListener('click', () => actualizarVisualizacion('mayores15'));
document.getElementById('btnTodos').addEventListener('click', () => actualizarVisualizacion('todos'));

