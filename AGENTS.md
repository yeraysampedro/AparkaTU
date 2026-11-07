# AparkaTu

## Alcance e implementacion

- Aplicacion estatica en castellano y euskera, orientada a toda Bizkaia. Abrir `index.html`; no requiere servidor ni compilacion.
- `model.js` contiene el catalogo, preferencias, accesibilidad, caducidad de lecturas, rutas de referencia, reportes, foro, Barik, justificantes y recompensas simuladas.
- `app.js` contiene las vistas, navegacion por hash, formularios y asistente local. Las preferencias se conservan; los datos de la visita no son un servicio compartido.
- Selector `#language-select` en la cabecera: Castellano/Euskara. La preferencia `language` acepta `es`/`eu`, se conserva al recargar y admite preferencias antiguas sin ese campo. Cambiar idioma no reconstruye los formularios ni borra borradores.
- `locales/eu.js` contiene el catalogo de traducciones y plantillas; `i18n.js` localiza texto y atributos accesibles, mantiene el castellano original para el cambio reversible y observa contenido dinamico. La traduccion es local, sin peticiones a servicios externos.
- AurreraTU incluye eventos, atascos, accidentes, obras y cortes, transporte publico y accesibilidad. `MOBILITY_ALERTS` contiene seis escenarios ficticios; `mobilityAlerts` filtra por categoria y municipio. `#incident` muestra zona, franja de ejemplo, procedencia y orientacion. Los contadores y la vista previa del mapa derivan del mismo modelo.
- Los contenidos de calor se mantienen en BateraTU (`#heat`), separados de la lista principal de incidencias de AurreraTU.
- `maps.js` combina Leaflet y MapLibre con cartografia externa de OpenFreeMap y alternativas de error/reintento. Los datos de aparcamiento siguen siendo simulados.
- Catalogo de muestra: 21 municipios de costa e interior; busqueda por municipio y alias, resultados locales, foro y panel publico territoriales. El destino inicial es Bizkaia.
- El mapa incluye todo el territorio, encuadra el destino y recuerda la vista por destino. Por debajo de zoom 12 muestra marcadores compactos; al acercarse muestra cifras.
- El ResizeObserver actualiza tanto Leaflet como el contenedor MapLibre: el adaptador vendorizado no redimensiona por si solo ese contenedor. Mantener esta sincronizacion para evitar desplazamientos entre cartografia y marcadores.
- Modo diurno con fondos informativos, bordes y texto secundario reforzados. Se conservan los colores nocturnos, preferencias de vision y lectura.
- Vista `#catalog`: primera fuente oficial incorporada, separada del mapa simulado. Incluye busqueda local, capacidad de residentes, PMR segun fuente, procedencia, licencia y enlaces externos a direcciones; no coloca coordenadas inventadas en el mapa.
- Redaccion de marca renovada: lema "Que aparcar no sea el plan", bienvenida centrada en los planes en Bizkaia y pie "Aparcar es solo el principio". El titulo de AurkiTU mantiene explicitamente el alcance Bizkaia; los nombres de municipios se conservan para fuentes y ejemplos locales concretos.
- `index.html` carga estilos, traducciones y aplicacion con la version `20261107-eu`. Si reaparece un titulo antiguo, comprobar la URL y los archivos servidos; no atribuirlo a cache sin verificar la pagina abierta.

## Invariantes

- Destinos desconocidos: mostrar ausencia de cobertura, nunca devolver Bilbao como sustituto.
- Mantener los filtros de accesibilidad al cambiar de municipio o cuando no haya resultados.
- Los nuevos marcadores son referencias municipales ficticias, no ubicaciones verificadas de parkings o sensores.
- `referenceJourney` restringe los tiempos e instrucciones simulados a Getxo -> San Mames. Para otros trayectos, mostrar itinerario no disponible y ofrecer explicitamente el ejemplo.
- Una lectura caducada o sin conexion significa desconocido, nunca libre. Ninguna cifra constituye una reserva.
- Las capas ambientales y de presion tienen muestras locales; no implican cobertura provincial real.
- No aplicar la clase utilitaria `.full` al ancho del estado de disponibilidad: `.availability.full` necesita `width: auto`.
- En el catalogo oficial, `plazasLibres` del inventario de residentes no se interpreta como ocupacion en tiempo real. Capacidad, existencia de PMR y acceso sin escalones son datos distintos; los no publicados permanecen en `null`.
- Los avisos de movilidad no son incidentes vigentes ni datos de trafico en directo. Mantener el aviso de simulacion en listas y detalles; ausencia de avisos no significa ausencia de incidencias. No inventar retrasos o desvios verificados.
- Mantener `translate="no"` en textos escritos por usuarios, alias, referencias y direcciones oficiales. Los valores de formularios no se traducen. En plantillas, solo traducir parametros explicitamente marcados; preservar nombres propios.
- Al agregar texto de interfaz, completar su entrada o plantilla en `locales/eu.js`. Para auditar contenido dinamico en navegador: `AparkaI18n.audit()` antes de navegar o cambiar idioma y `AparkaI18n.missing()` despues. Revisar tambien dialogos, estados vacios, errores y ventanas del mapa.
- La lectura por voz usa el idioma elegido. Si el navegador no dispone de una voz en euskera, mostrar el aviso; no leer euskera con una voz castellana por defecto.

## Fuente Oficial Y Actualizacion

- Fuente comprobada el 2026-11-07: [Aparcamientos Municipales para Residentes, Ayuntamiento de Bilbao](https://www.bilbao.eus/opendata/es/catalogo/dato-aparcamientos-residentes). Cobertura limitada a Bilbao y a ese regimen de acceso, no a toda Bizkaia ni a parkings de rotacion.
- [JSON oficial](https://www.bilbao.eus/cs/Satellite?c=Page&language=es&pageid=1272990695486&pagename=Bilbaonet/Page/OD_aparcamientosResidentes&formato=JSON), licencia [CC BY 3.0 ES](https://creativecommons.org/licenses/by/3.0/es/). La fuente anuncia actualizacion diaria, pero no publica fecha de ocupacion, coordenadas ni acceso sin escalones en cada registro.
- La descarga comprobada contiene 52 filas: 21 con nombre y direccion y 31 incompletas excluidas. Se conservan los contadores de origen y exclusion; la interfaz hace visible esta limitacion.
- Actualizar con Node 20 o posterior: `node scripts/update-catalog.cjs`. Genera `assets/data/parking-catalog.js`, con fecha de consulta, fuente, licencia y SHA-256 de la respuesta UTF-8. Validar y sustituir solo tras una importacion correcta; si falla, conservar la copia anterior.
- El activo generado permite abrir la app mediante `file:///` y consultar el catalogo sin red ni CORS. No se refresca automaticamente. La fecha de consulta no acredita actualidad del contenido ni disponibilidad de plazas.
- La busqueda no envia texto a terceros. Los enlaces a fuentes/licencia y la busqueda de una direccion publica en OpenStreetMap se abren solo por accion del usuario.

## Verificacion

- Ejecutar `node --test model.test.js i18n.test.js`: territorio, filtros, caducidad, rutas, foro, catalogo oficial, preferencias retrocompatibles, avisos y traducciones; sin dependencias externas. La suite comprueba todas las entradas del diccionario, parametros de plantillas y traduccion de cada aviso.
- Usar navegador headless. Verificar busqueda municipal, destino sin datos, asistente, panel publico y persistencia del tema.
- Revisar escritorio y movil en ambos temas, contraste de texto y desbordamiento horizontal.
- Al modificar mapas, comprobar la carga de cartografia, controles, zoom y coincidencia de las proyecciones Leaflet/MapLibre tras redimensionar.
- Verificado el 2026-11-07 en Chromium headless: pruebas del modelo, flujos territoriales, 360/390/1440 px, ambos temas, capturas y alineacion del mapa. El contraste minimo de las muestras de texto informativo comprobadas fue 5.42:1; no equivale a una auditoria WCAG completa.
- Catalogo oficial comprobado con busqueda, estado sin copia, ausencia de sustituciones por otro municipio, escape de entradas, asistente y cero peticiones de red en consultas locales. Contraste minimo de los textos muestreados del catalogo: 6.36:1.
- Redaccion comprobada en el DOM de mapa y bienvenida, tras navegacion y recarga, y en cargas independientes de 360/390/1440 px en ambos temas. Sin lemas anteriores ni desbordamiento de los nuevos textos en esas comprobaciones.
- Bilinguismo comprobado el 2026-11-07: auditoria de 32 vistas, validaciones y asistente; 60 combinaciones de pantalla, ancho y tema en euskera sin desbordamientos. Comprobados persistencia del idioma, vuelta al castellano, borradores, publicaciones y alias sin traducir, filtrado de avisos y estados sin resultados. Las 30 ventanas de aparcamientos y entorno pasan la auditoria de traduccion.

## Pendiente Para Producto Real

- Revision linguistica de euskera por una persona cualificada antes de una publicacion oficial.
- Investigar una excepcion `getZoom` sobre `null` observada en una prueba que encadenaba navegacion y redimensionado rapido del mapa. No aparecio en las cargas independientes; no se ha modificado la logica cartografica en la tarea de redaccion.
- Ampliar las fuentes oficiales a otros municipios de Bizkaia y aparcamientos de rotacion, con ubicaciones verificadas. Las 21 muestras territoriales y los 21 registros oficiales de residentes de Bilbao son conjuntos distintos; ninguno aporta cobertura real completa.
- Fuentes reales de disponibilidad, restricciones, plazas PMR, horarios y estado de accesos.
- Geocodificacion de direcciones y motor de rutas con transporte publico, tiempos y accesibilidad verificables.
- Agenda, avisos y capas ambientales con cobertura territorial, procedencia y vigencia.
- Backend y acuerdos con operadores para reportes compartidos, foro, Barik, justificantes y recompensas reales.