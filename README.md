# Analisis-sobre-Conocimiento-y-conciencia-sobre-los-derechos-humanos-en-infantes-y-adolecentes
El repositorio contiene

1. Base de datos de una encuesta sobre Derecho Humanos a niños y adolescentes. La base de datos la puedes encontrar en https://datamx.io/dataset/conocimiento-y-conciencia-sobre-los-derechos-humanos-en-ninas-ninos-y-adolescentes/resource/f3388af8-b7eb-42d4-941d-eb92f31eb845
2. Un Jupyter Notebook con un pequeño análisis exploratorio, para intentar ver cómo se iban a visualizar los datos.
3. Una base de datos que se filtró en el Jupyter Notebook, que nos haría más fácil la visualización de los datos.
4. Los archivos principales para la visualización: main.js, index.html y style.css
   1. En el main se utilizó gráficos burbuja con gravedad de D3 para visualizar las respuestas de los encuestados
   
## Descripción del Proyecto:
En el marco del 3er Hackatón por los Derechos de la Niñez y la Adolescencia en México, nuestro equipo propone el desarrollo de una "FrontPage" interactiva para una página web dedicada a los derechos humanos, con el objetivo de captar la atención y fomentar una mayor conciencia sobre los derechos de las niñas, niños y adolescentes en México. Este proyecto se basará en la base de datos “Conocimiento y conciencia sobre los derechos humanos en niñas, niños y adolescentes”, realizada por NIMA – Centro de Promoción de los Derechos Humanos de Niñas, Niños y Adolescentes en Guanajuato, que fueron encuestas realizadas a jóvenes entre 8 y 17 años, donde expresan en sus propias palabras lo que entienden por "Derechos Humanos" y su percepción sobre la protección de estos derechos en su vida diaria.

## Metodología:
Utilizaremos una base de datos que incluye respuestas a preguntas como "¿Qué son para ti los Derechos Humanos?", "¿Qué significa ser una persona?" y "¿Cuáles derechos conoces?". Hemos realizado un análisis exploratorio preliminar para entender las tendencias y diferencias en las percepciones según las edades de los participantes (en un JupyterNotebook). La visualización será dinámica y permitirá a los usuarios filtrar las respuestas por rangos de edad, destacando la diversidad de entendimientos y preocupaciones a través de burbujas de texto interactivas que se adaptan en tamaño y color basándose en el contenido de las respuestas.

## Tecnología:
El corazón técnico de nuestra solución se compone de HTML, CSS y JavaScript, integrando bibliotecas como D3.js para la creación de visualizaciones dinámicas y SVG para la renderización de gráficos en la web. Nuestro código incluye funciones para la carga y procesamiento de datos desde un archivo CSV, la selección de datos según el grupo de edad y la generación de visualizaciones de burbujas que pueden ser manipuladas interactivamente por los usuarios para explorar las distintas perspectivas de los niños y adolescentes sobre sus derechos.
 

## Impacto Esperado:
Creemos firmemente que esta herramienta no solo educará a la población sobre la situación de los derechos de la infancia y la adolescencia en México, sino que también empoderará a los ciudadanos para actuar en defensa de estos derechos. Al presentar las voces de los jóvenes de una manera visualmente atractiva y accesible, esperamos fomentar un diálogo constructivo que conduzca a cambios significativos en la política y la sociedad en general.

