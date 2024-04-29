let estadoActual = 0; // Índice del estado inicial
// botón >>
const estados = [
    {
        titulo: 'title1.png',
        columna: '¿Qué son para ti los Derechos Humanos?'
    },
    {
        titulo: 'title2.png',
        columna: '¿Qué significa ser una persona?'
    }, 
    {
        titulo: 'title3.png',
        columna: '¿Cuáles derechos conoces?'
    } 
];
function actualizarEstado() {
    estadoActual = (estadoActual + 1) % estados.length; // Avanzar al siguiente estado
    document.getElementById('imgTitulo').src = estados[estadoActual].titulo; // Cambiar imagen del título
    cargarDatos(); // Recargar y mostrar los datos según el nuevo estado
}
document.getElementById('btnCambio').addEventListener('click', actualizarEstado);
// 
const MAX_WIDTH = 300; // Máximo ancho del texto antes de hacer un salto de línea
const LINE_HEIGHT = 20; // Altura de línea para el texto dentro de la burbuja
const MIN_RADIUS = 150; // Radio mínimo de la burbuja
// Variables globales para almacenar los datos procesados y poder reutilizarlos
let datosProcesados;
async function cargarDatos() {
    const response = await fetch('encuesta_dh_filtrada.csv');
    const csvText = await response.text();
    const data = csvToArray(csvText, ';');
    
    var columnaActual = estados[estadoActual].columna; // Usar la columna según el estado actual

    datosProcesados = data
        .filter(d => d[columnaActual] && d["¿Cuántos años cumplidos tienes? (anota el número)"])
        .map(d => ({
            respuesta: d[columnaActual],
            edad: parseFloat(d["¿Cuántos años cumplidos tienes? (anota el número)"]),
            radius: Math.sqrt(d[columnaActual].length) * 2,
            color: 'gray'
        }));

    console.log(datosProcesados);
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

function seleccionarAleatoriamente(arr, num = 15) {
    const shuffledArray = [...arr];
    let m = shuffledArray.length, t, i;
  
    // Mientras queden elementos a mezclar...
    while (m) {
      // Escoger un elemento restante...
      i = Math.floor(Math.random() * m--);
  
      // Y cambiarlo por el elemento actual.
      t = shuffledArray[m];
      shuffledArray[m] = shuffledArray[i];
      shuffledArray[i] = t;
    }
  
    return shuffledArray.slice(0, num);
}

// Función para generar un color PASTEL aleatorio
function colorAleatorioPastel() {
    // Hue (0-360): Cualquier tono del círculo cromático.
    // Saturation (25-75%): Saturación baja para suavizar el color.
    // Lightness (75-90%): Alta luminosidad para obtener un tono pastel.
    const hue = Math.random() * 360;
    const saturation = 25 + Math.random() * 50;
    const lightness = 75 + Math.random() * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
    const height = 800;

    let datosAleatorios = seleccionarAleatoriamente(datosFiltrados);
    console.log(datosAleatorios);
    

    // Calcula el radio de las burbujas basado en el texto
    const context = document.createElement('canvas').getContext('2d');
    // Dentro de la función donde calculas el radio y las líneas
    context.font = '16px sans-serif'; // Establece el mismo estilo de fuente que usarás en SVG
    datosAleatorios.forEach(d => {
        let words = d.respuesta.split(' ');
        let lines = [];
        let line = '';
        let widthOfLongestLine = 0;

        words.forEach(word => {
            let testLine = line + word + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > MAX_WIDTH && line.length > 0) {
                lines.push(line);
                widthOfLongestLine = Math.max(widthOfLongestLine, testWidth);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        if (line.length > 0) {
            lines.push(line);
            widthOfLongestLine = Math.max(widthOfLongestLine, context.measureText(line).width);
        }

        let newRadius = Math.sqrt((widthOfLongestLine / Math.PI) * (LINE_HEIGHT * lines.length));
        d.radius = Math.max(MIN_RADIUS, newRadius);
        d.lines = lines;
    });

    let svg = d3.select('#viz').select('svg');
    if (svg.empty()) {
        svg = d3.select('#viz').append('svg')
            .attr('width', width)
            .attr('height', height);
    }

    // Asegúrate de detener cualquier simulación existente
    if (svg.node().__simulation) {
        svg.node().__simulation.stop();
    }


    // Crear la simulación de fuerzas para las burbujas con datosAleatorios
    const simulation = d3.forceSimulation(datosAleatorios)
        .force('charge', d3.forceManyBody().strength(10))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius));

    // Eliminar las burbujas existentes antes de crear nuevas
    svg.selectAll('.bubble').remove();
    svg.selectAll('.texto').remove();
    

    // Crear nuevas burbujas basadas en datosAleatorios
    const burbujas = svg.selectAll('.bubble')
        .data(datosAleatorios, d => d.respuesta)
        .enter().append('circle')
        .attr('class', 'bubble')
        .attr('r', d => d.radius)
        .attr('fill', colorAleatorioPastel)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Guardar la referencia a la simulación en el nodo SVG
    svg.node().__simulation = simulation;

    const textos = svg.selectAll('.texto')
        .data(datosAleatorios, d => d.respuesta)
        .enter().append('text')
        .attr('class', 'texto')
        .text(d => d.respuesta)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'middle')
        .style('font-size', '16px');

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

    // Define la función ticked para actualizar las posiciones de las burbujas
    function ticked() {
        svg.selectAll('.bubble')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    
        svg.selectAll('.texto').remove(); // Mueve esto al principio de la función ticked
    
        // Dibuja cada línea de texto
        datosAleatorios.forEach(d => {
            let y = d.y - (d.lines.length - 1) * LINE_HEIGHT / 2;
            d.lines.forEach((line, index) => {
                svg.append('text')
                    .attr('class', 'texto')
                    .attr('x', d.x)
                    .attr('y', y + (index * LINE_HEIGHT))
                    .text(line)
                    .attr('fill', 'black')
                    .style('text-anchor', 'middle')
                    .style('alignment-baseline', 'middle')
                    .style('font-size', '16px');
            });
        });
    }

    // Inicia la simulación con ticked
    simulation.on('tick', ticked);
}

cargarDatos();

document.getElementById('btnMenores10').addEventListener('click', () => actualizarVisualizacion('menores10'));
document.getElementById('btnEntre10y15').addEventListener('click', () => actualizarVisualizacion('entre10y15'));
document.getElementById('btnMayores15').addEventListener('click', () => actualizarVisualizacion('mayores15'));
document.getElementById('btnTodos').addEventListener('click', () => actualizarVisualizacion('todos'));

