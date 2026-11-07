# AparkaTu

## Alcance e implementacion

- Aplicacion estatica en espanol, orientada a toda Bizkaia. Abrir `index.html`; no requiere servidor ni compilacion.
- `model.js` contiene el catalogo, preferencias, accesibilidad, caducidad de lecturas, rutas de referencia, reportes, foro, Barik, justificantes y recompensas simuladas.
- `app.js` contiene las vistas, navegacion por hash, formularios y asistente local. Las preferencias se conservan; los datos de la visita no son un servicio compartido.
- `maps.js` combina Leaflet y MapLibre con cartografia externa de OpenFreeMap y alternativas de error/reintento. Los datos de aparcamiento siguen siendo simulados.
- Catalogo de muestra: 21 municipios de costa e interior; busqueda por municipio y alias, resultados locales, foro y panel publico territoriales. El destino inicial es Bizkaia.
- El mapa incluye todo el territorio, encuadra el destino y recuerda la vista por destino. Por debajo de zoom 12 muestra marcadores compactos; al acercarse muestra cifras.
- El ResizeObserver actualiza tanto Leaflet como el contenedor MapLibre: el adaptador vendorizado no redimensiona por si solo ese contenedor. Mantener esta sincronizacion para evitar desplazamientos entre cartografia y marcadores.
- Modo diurno con fondos informativos, bordes y texto secundario reforzados. Se conservan los colores nocturnos, preferencias de vision y lectura.
- Vista `#catalog`: primera fuente oficial incorporada, separada del mapa simulado. Incluye busqueda local, capacidad de residentes, PMR segun fuente, procedencia, licencia y enlaces externos a direcciones; no coloca coordenadas inventadas en el mapa.

## Invariantes

- Destinos desconocidos: mostrar ausencia de cobertura, nunca devolver Bilbao como sustituto.
- Mantener los filtros de accesibilidad al cambiar de municipio o cuando no haya resultados.
- Los nuevos marcadores son referencias municipales ficticias, no ubicaciones verificadas de parkings o sensores.
- `referenceJourney` restringe los tiempos e instrucciones simulados a Getxo -> San Mames. Para otros trayectos, mostrar itinerario no disponible y ofrecer explicitamente el ejemplo.
- Una lectura caducada o sin conexion significa desconocido, nunca libre. Ninguna cifra constituye una reserva.
- Las capas ambientales y de presion tienen muestras locales; no implican cobertura provincial real.
- No aplicar la clase utilitaria `.full` al ancho del estado de disponibilidad: `.availability.full` necesita `width: auto`.
- En el catalogo oficial, `plazasLibres` del inventario de residentes no se interpreta como ocupacion en tiempo real. Capacidad, existencia de PMR y acceso sin escalones son datos distintos; los no publicados permanecen en `null`.

## Fuente Oficial Y Actualizacion

- Fuente comprobada el 2026-11-07: [Aparcamientos Municipales para Residentes, Ayuntamiento de Bilbao](https://www.bilbao.eus/opendata/es/catalogo/dato-aparcamientos-residentes). Cobertura limitada a Bilbao y a ese regimen de acceso, no a toda Bizkaia ni a parkings de rotacion.
- [JSON oficial](https://www.bilbao.eus/cs/Satellite?c=Page&language=es&pageid=1272990695486&pagename=Bilbaonet/Page/OD_aparcamientosResidentes&formato=JSON), licencia [CC BY 3.0 ES](https://creativecommons.org/licenses/by/3.0/es/). La fuente anuncia actualizacion diaria, pero no publica fecha de ocupacion, coordenadas ni acceso sin escalones en cada registro.
- La descarga comprobada contiene 52 filas: 21 con nombre y direccion y 31 incompletas excluidas. Se conservan los contadores de origen y exclusion; la interfaz hace visible esta limitacion.
- Actualizar con Node 20 o posterior: `node scripts/update-catalog.cjs`. Genera `assets/data/parking-catalog.js`, con fecha de consulta, fuente, licencia y SHA-256 de la respuesta UTF-8. Validar y sustituir solo tras una importacion correcta; si falla, conservar la copia anterior.
- El activo generado permite abrir la app mediante `file:///` y consultar el catalogo sin red ni CORS. No se refresca automaticamente. La fecha de consulta no acredita actualidad del contenido ni disponibilidad de plazas.
- La busqueda no envia texto a terceros. Los enlaces a fuentes/licencia y la busqueda de una direccion publica en OpenStreetMap se abren solo por accion del usuario.

## Verificacion

- Ejecutar `node --test model.test.js`: territorio, alias, filtros, caducidad, rutas, foro, normalizacion del catalogo, integridad de la copia y conservacion ante fallos de actualizacion; sin dependencias externas.
- Usar navegador headless. Verificar busqueda municipal, destino sin datos, asistente, panel publico y persistencia del tema.
- Revisar escritorio y movil en ambos temas, contraste de texto y desbordamiento horizontal.
- Al modificar mapas, comprobar la carga de cartografia, controles, zoom y coincidencia de las proyecciones Leaflet/MapLibre tras redimensionar.
- Verificado el 2026-11-07 en Chromium headless: pruebas del modelo, flujos territoriales, 360/390/1440 px, ambos temas, capturas y alineacion del mapa. El contraste minimo de las muestras de texto informativo comprobadas fue 5.42:1; no equivale a una auditoria WCAG completa.
- Catalogo oficial comprobado con busqueda, estado sin copia, ausencia de sustituciones por otro municipio, escape de entradas, asistente y cero peticiones de red en consultas locales. Contraste minimo de los textos muestreados del catalogo: 6.36:1.

## Pendiente Para Producto Real

- Ampliar las fuentes oficiales a otros municipios de Bizkaia y aparcamientos de rotacion, con ubicaciones verificadas. Las 21 muestras territoriales y los 21 registros oficiales de residentes de Bilbao son conjuntos distintos; ninguno aporta cobertura real completa.
- Fuentes reales de disponibilidad, restricciones, plazas PMR, horarios y estado de accesos.
- Geocodificacion de direcciones y motor de rutas con transporte publico, tiempos y accesibilidad verificables.
- Agenda, avisos y capas ambientales con cobertura territorial, procedencia y vigencia.
- Backend y acuerdos con operadores para reportes compartidos, foro, Barik, justificantes y recompensas reales.