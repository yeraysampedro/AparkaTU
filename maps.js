const AparkaMaps = (() => {
  'use strict';

  const M = AparkaModel;
  const BIZKAIA = [43.23, -2.91];
  const BIZKAIA_BOUNDS = [[42.96, -3.46], [43.47, -2.40]];
  const SAN_MAMES = [43.2642, -2.9494];
  const STYLES = {
    light: 'https://tiles.openfreemap.org/styles/positron',
    dark: 'https://tiles.openfreemap.org/styles/dark'
  };
  const ATTRIBUTION = '<a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">© OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>';
  const ZONES = [
    { label: 'A · Alta presión', type: 'high', center: [43.2653, -2.9497], points: [[43.268, -2.955], [43.269, -2.949], [43.266, -2.9438], [43.2611, -2.9463], [43.2614, -2.9535]] },
    { label: 'B · Baja presión', type: 'low', center: [43.2745, -2.9551], points: [[43.2781, -2.9591], [43.2777, -2.9518], [43.2737, -2.9496], [43.2721, -2.9552], [43.2746, -2.9601]] }
  ];
  const views = new Map();
  const live = new Set();
  let mapSequence = 0;
  let webglAvailable;
  const colors = () => getComputedStyle(document.body);
  const theme = () => document.body.dataset.theme === 'dark' ? 'dark' : 'light';
  const stamp = M.formatTime;
  const elapsed = M.formatAge;
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function supportsWebGL() {
    if (webglAvailable !== undefined) return webglAvailable;
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      webglAvailable = !!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (error) {
      console.warn('AparkaTu: el navegador no permite iniciar WebGL.', error);
      webglAvailable = false;
    }
    return webglAvailable;
  }
  function setStatus(record, message, failed = false) {
    if (record.closed) return;
    const status = record.wrapper.querySelector('[data-map-status]');
    if (status.textContent !== message) status.textContent = message;
    record.wrapper.dataset.mapStatus = failed ? 'error' : 'loading';
    record.wrapper.querySelector('[data-map-command="retry"]').hidden = !failed;
  }
  function mapError(record, message, error) {
    clearTimeout(record.timeout);
    record.failed = true;
    setStatus(record, message, true);
    if (error) console.warn('AparkaTu: no se pudo cargar la cartografía.', error);
  }
  function ready(record) {
    if (record.closed || record.failed || record.loadingStyle || !record.gl.isStyleLoaded() || !record.gl.areTilesLoaded()) return;
    clearTimeout(record.timeout);
    record.wrapper.dataset.mapStatus = 'ready';
    record.wrapper.querySelector('[data-map-status]').textContent = 'Cartografía OpenStreetMap';
    record.wrapper.querySelector('[data-map-command="retry"]').hidden = true;
  }
  async function loadStyle(record) {
    record.request?.abort();
    const request = new AbortController();
    record.request = request;
    record.failed = false;
    record.loadingStyle = true;
    record.theme = theme();
    clearTimeout(record.timeout);
    setStatus(record, 'Cargando cartografía…');
    record.timeout = setTimeout(() => {
      if (record.closed || record.wrapper.dataset.mapStatus === 'ready') return;
      mapError(record, 'El mapa tarda en responder. Comprueba la conexión y reintenta.');
    }, 20000);
    try {
      const response = await fetch(STYLES[record.theme], { signal: request.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
      if (!response.ok) throw new Error(`OpenFreeMap: HTTP ${response.status}`);
      const style = await response.json();
      if (!Array.isArray(style.layers)) throw new Error('El proveedor no devolvió un estilo de mapa válido.');
      if (record.closed || request.signal.aborted) return;
      styleBasemap(record, style);
      record.gl.setStyle(style, { diff: false });
      record.loadingStyle = false;
    } catch (error) {
      if (record.closed || request.signal.aborted) return;
      record.loadingStyle = false;
      mapError(record, 'No se pudo descargar la cartografía. Comprueba la conexión y reintenta.', error);
    }
  }
  function styleBasemap(record, style) {
    for (const layer of style.layers) {
      // A plain fill keeps the simulated pressure areas separate from map textures.
      if (layer.type === 'fill' && layer.paint) delete layer.paint['fill-pattern'];
      if (record.theme !== 'dark') continue;
      layer.paint = { ...layer.paint };
      if (layer.type === 'background') layer.paint['background-color'] = '#18231d';
      if (layer.type === 'fill') {
        const source = layer['source-layer'];
        if (source === 'water') layer.paint['fill-color'] = '#2c4b53';
        if (source === 'building') layer.paint['fill-color'] = '#364239';
        if (source === 'landuse') layer.paint['fill-color'] = '#223327';
        if (source === 'landcover' || source === 'park') layer.paint['fill-color'] = '#2d4130';
      }
      if (layer.type === 'line' && layer['source-layer'] === 'transportation') {
        layer.paint['line-color'] = layer.id.includes('casing') ? '#17241c' : '#637362';
      }
      if (layer.type === 'symbol' && layer.layout?.['text-field'] !== undefined) {
        layer.paint['text-color'] = '#d4dfd0';
        layer.paint['text-halo-color'] = '#18231d';
        layer.paint['text-halo-width'] = 1.5;
      }
    }
  }
  function popupContent(record, parking) {
    const reading = M.parkingStatus(parking, record.state);
    const content = node('div', 'parking-map-popup');
    content.append(node('strong', '', parking.name));
    content.append(node('p', `popup-availability ${reading.kind}`,
      reading.available === null ? 'Disponibilidad desconocida' : `${reading.available} plazas · ${reading.label}`));
    content.append(node('p', '', parking.mapReference));
    content.append(node('p', 'popup-freshness', `${parking.sensor.id} · ${stamp(reading.updatedAt)} · hace ${elapsed(reading.ageMs)}`));
    content.append(node('p', 'footnote', 'Plazas y sensores simulados. El marcador no señala una entrada verificada.'));
    const detail = node('button', 'button green small', 'Ver aparcamiento');
    detail.type = 'button';
    detail.addEventListener('click', event => {
      L.DomEvent.stopPropagation(event);
      record.onParking(parking.id);
    });
    content.append(detail);
    return content;
  }
  function markerIcon(parking, reading, overview) {
    const label = node('div', `parking-map-pin is-${reading.kind}${overview ? ' is-overview' : ''}`);
    const count = node('div', 'parking-map-count');
    count.append(node('span', 'parking-map-kind', parking.type === 'pr' ? 'P+R' : 'P'));
    count.append(node('strong', '', reading.available === null ? '?' : String(reading.available)));
    label.append(count, node('span', 'parking-map-status', reading.label));
    return L.divIcon({ className: 'parking-map-marker', html: label, iconSize: overview ? [16, 16] : [104, 55], iconAnchor: overview ? [8, 8] : [52, 55], popupAnchor: overview ? [0, -8] : [0, -52] });
  }
  function syncMarkers(record) {
    const overview = record.map.getZoom() < 12;
    record.wrapper.querySelector('.live-map').classList.toggle('territory-overview', overview);
    const focus = M.PARKINGS.find(p => p.id === record.wrapper.dataset.mapFocus);
    const selected = focus ? [focus] : record.wrapper.dataset.mapParkings === 'true' ? M.results(record.state) : [];
    const included = new Set(selected.map(p => p.id));
    for (const [id, item] of record.markers) {
      if (!included.has(id)) {
        item.marker.remove();
        record.markers.delete(id);
      }
    }
    for (const parking of selected) {
      const reading = M.parkingStatus(parking, record.state);
      let item = record.markers.get(parking.id);
      if (!item) {
        const label = `${parking.name}: ${reading.available === null ? 'disponibilidad desconocida' : reading.available + ' plazas orientativas'}. Datos de ejemplo.`;
        const marker = L.marker(parking.coordinates, {
          icon: markerIcon(parking, reading, overview), keyboard: true, title: label, alt: label,
          riseOnHover: true, autoPanOnFocus: true
        }).addTo(record.map);
        marker.bindTooltip(parking.name, { direction: 'top', offset: [0, overview ? -9 : -54] });
        marker.bindPopup(() => popupContent(record, parking), { minWidth: 205, maxWidth: 280 });
        marker.on('popupopen', () => {
          const close = marker.getPopup().getElement().querySelector('.leaflet-popup-close-button');
          if (close) close.setAttribute('aria-label', 'Cerrar detalle');
        });
        item = { marker, available: reading.available, kind: reading.kind, overview };
        record.markers.set(parking.id, item);
      } else if (item.available !== reading.available || item.kind !== reading.kind || item.overview !== overview) {
        item.marker.setIcon(markerIcon(parking, reading, overview));
        item.marker.getTooltip().options.offset = L.point(0, overview ? -9 : -54);
        item.available = reading.available;
        item.kind = reading.kind;
        item.overview = overview;
      }
      const iconElement = item.marker.getElement();
      if (iconElement) {
        const label = `${parking.name}: ${reading.available === null ? 'disponibilidad desconocida' : `${reading.available} plazas · ${reading.label}`}. Datos de ejemplo.`;
        iconElement.title = label;
        iconElement.setAttribute('aria-label', label);
      }
      if (item.marker.isPopupOpen()) {
        const popup = item.marker.getPopup().getElement();
        const availability = popup.querySelector('.popup-availability');
        availability.className = `popup-availability ${reading.kind}`;
        availability.textContent = reading.available === null ? 'Disponibilidad desconocida' : `${reading.available} plazas · ${reading.label}`;
        const fresh = popup.querySelector('.popup-freshness');
        if (fresh) fresh.textContent = `${parking.sensor.id} · ${stamp(reading.updatedAt)} · hace ${elapsed(reading.ageMs)}`;
      }
    }
  }
  function syncZones(record) {
    const unknown = record.state.dataMode !== 'fresh' || M.PARKINGS.every(p => M.reading(p, record.state).available === null);
    const css = colors();
    const signature = [unknown, css.getPropertyValue('--risk'), css.getPropertyValue('--calm'), css.getPropertyValue('--gray-soft')].join('|');
    if (signature === record.zoneSignature) return;
    record.zoneSignature = signature;
    record.zones.clearLayers();
    for (const zone of ZONES) {
      const color = css.getPropertyValue(unknown ? '--muted' : zone.type === 'high' ? '--risk' : '--calm').trim();
      const fill = css.getPropertyValue(unknown ? '--gray-soft' : zone.type === 'high' ? '--risk-soft' : '--calm-soft').trim();
      if (!unknown) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const id = `pressure-${record.sequence}-${zone.type}`;
        svg.setAttribute('viewBox', '0 0 200 200');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = `<defs><radialGradient id="${id}"><stop offset="0%" stop-color="${color}" stop-opacity=".55"/><stop offset="50%" stop-color="${color}" stop-opacity=".26"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><ellipse cx="100" cy="100" rx="100" ry="100" fill="url(#${id})"/>`;
        L.svgOverlay(svg, L.latLngBounds(zone.points), { interactive: false }).addTo(record.zones);
      }
      L.polygon(zone.points, { color, fillColor: fill, fillOpacity: unknown ? .32 : .1, weight: 2, dashArray: '5 5', interactive: false }).addTo(record.zones);
      const label = node('span', `pressure-map-label ${unknown ? 'unknown' : zone.type}`, unknown ? '? · Sin datos' : zone.label);
      L.marker(zone.center, {
        icon: L.divIcon({ className: 'pressure-map-marker', html: label, iconSize: [128, 26], iconAnchor: [64, 13] }),
        interactive: false, keyboard: false
      }).addTo(record.zones);
    }
  }
  function environmentPopup(title, detail, note) {
    const content = node('div', 'environment-popup');
    content.append(node('strong', '', title), node('p', '', detail), node('p', 'footnote', note));
    return content;
  }
  function syncEnvironment(record) {
    const selected = record.state.environmentLayers;
    const airStates = M.ENVIRONMENT.air.map(station => M.airReading(station, record.state));
    const signature = [selected.refuges, selected.air, selected.shade, theme(), ...airStates.map(r => r.status)].join('|');
    if (signature !== record.environmentSignature) {
      record.environmentSignature = signature;
      record.environment.clearLayers();
      record.airMarkers = [];
      if (selected.refuges) {
        for (const place of M.ENVIRONMENT.refuges) {
          const label = node('span', 'environment-map-pin refuge-pin', 'R');
          const marker = L.marker(place.coordinates, { icon: L.divIcon({ className: 'environment-map-marker', html: label, iconSize: [34, 34], iconAnchor: [17, 34] }), title: `Refugio de referencia: ${place.name}`, alt: `Refugio de referencia: ${place.name}`, keyboard: true });
          marker.bindTooltip(place.name);
          marker.bindPopup(() => environmentPopup(place.name, place.detail, 'BateraTU · ubicación de referencia, no un refugio certificado en tiempo real.'));
          marker.addTo(record.environment);
          marker.getElement().setAttribute('aria-label', `Refugio climático de referencia: ${place.name}`);
        }
      }
      if (selected.air) {
        for (const station of M.ENVIRONMENT.air) {
          const reading = M.airReading(station, record.state);
          const label = node('span', `environment-map-pin air-pin${reading.value === null ? ' unknown' : ''}`, reading.value === null ? 'A ?' : `A ${reading.value}`);
          const marker = L.marker(station.coordinates, { icon: L.divIcon({ className: 'environment-map-marker', html: label, iconSize: [48, 34], iconAnchor: [24, 34] }), title: `Calidad del aire · ${station.name} · datos de ejemplo`, keyboard: true });
          marker.bindPopup(() => {
            const r = M.airReading(station, record.state);
            const popup = environmentPopup(`Aire · ${station.name}`, r.value === null ? 'PM₂.₅: desconocido. La lectura no es válida.' : `PM₂.₅: ${r.value} µg/m³ · cifra de ejemplo, no una medición real.`, 'No utilices este dato para decidir si el aire es seguro. Consulta la red oficial.');
            popup.append(node('p', 'air-reading-age', `${stamp(r.updatedAt)} · hace ${elapsed(r.ageMs)}`));
            return popup;
          }).addTo(record.environment);
          marker.getElement().setAttribute('aria-label', `Calidad del aire en ${station.name}: ${reading.value === null ? 'desconocida' : `${reading.value} microgramos por metro cúbico de PM 2,5, ejemplo`}`);
          record.airMarkers.push({ station, marker });
        }
      }
      if (selected.shade) {
        for (const route of M.ENVIRONMENT.shade) {
          const popup = () => environmentPopup(route.name, route.detail, 'BateraTU · itinerario sombreado de ejemplo. Sigue la señalización y comprueba las condiciones reales.');
          L.polyline(route.points, { color: theme() === 'dark' ? '#ebc784' : '#855512', weight: 6, dashArray: '10 7' })
            .bindTooltip(route.name)
            .bindPopup(popup)
            .addTo(record.environment);
          const marker = L.marker(route.points[Math.floor(route.points.length / 2)], {
            icon: L.divIcon({ className: 'environment-map-marker', html: node('span', 'environment-map-pin shade-pin', 'S'), iconSize: [34, 34], iconAnchor: [17, 34] }),
            title: `Itinerario sombreado de ejemplo: ${route.name}`, alt: `Itinerario sombreado de ejemplo: ${route.name}`, keyboard: true
          }).bindPopup(popup).addTo(record.environment);
          marker.getElement().setAttribute('aria-label', `Itinerario sombreado de ejemplo: ${route.name}`);
        }
      }
    }
    for (const { station, marker } of record.airMarkers) {
      if (!marker.isPopupOpen()) continue;
      const r = M.airReading(station, record.state);
      marker.getPopup().getElement().querySelector('.air-reading-age').textContent = `${stamp(r.updatedAt)} · hace ${elapsed(r.ageMs)}`;
    }
    for (const input of record.wrapper.querySelectorAll('[data-map-layer]')) input.checked = selected[input.dataset.mapLayer];
  }
  function remember(record) {
    if (!record.map || record.closed) return;
    views.set(record.key, { center: record.map.getCenter(), zoom: record.map.getZoom(), pressure: record.pressure });
  }
  function destroy() {
    for (const record of live) {
      remember(record);
      record.closed = true;
      clearTimeout(record.timeout);
      record.request?.abort();
      record.observer?.disconnect();
      if (record.gl) {
        record.gl.off('error', record.onError);
        record.gl.off('idle', record.onIdle);
      }
      record.wrapper.removeEventListener('click', record.onCommand);
      record.wrapper.removeEventListener('change', record.onChange);
      record.map?.remove();
    }
    live.clear();
  }
  function mount(root, state, onParking) {
    for (const wrapper of root.querySelectorAll('[data-leaflet-map]')) {
      const record = { wrapper, state, onParking, key: wrapper.dataset.mapKey, sequence: ++mapSequence, markers: new Map(), airMarkers: [], pressure: true, closed: false, failed: false, theme: theme() };
      live.add(record);
      if (!window.L || !window.maplibregl || typeof L.maplibreGL !== 'function') {
        mapError(record, 'Faltan archivos del mapa. Mantén la carpeta assets junto a la página.');
        record.wrapper.querySelector('[data-map-command="retry"]').hidden = true;
        continue;
      }
      if (!supportsWebGL()) {
        mapError(record, 'El mapa necesita WebGL. Activa la aceleración gráfica o usa un navegador actualizado.');
        record.wrapper.querySelector('[data-map-command="retry"]').hidden = true;
        continue;
      }
      const focus = M.PARKINGS.find(p => p.id === wrapper.dataset.mapFocus);
      const destination = M.municipalityFor(state.destination);
      const cached = views.get(record.key);
      const initialCenter = focus ? focus.coordinates : state.view === 'event' ? SAN_MAMES : destination ? destination.coordinates : BIZKAIA;
      const initialZoom = focus ? 16 : state.view === 'event' ? 15 : destination ? 14 : 9;
      record.pressure = cached ? cached.pressure : true;
      wrapper.querySelector('[data-map-command="pressure"]').checked = record.pressure;
      const container = wrapper.querySelector('.live-map');
      try {
        record.map = L.map(container, {
          center: cached ? cached.center : initialCenter, zoom: cached ? cached.zoom : initialZoom,
          minZoom: 8, maxZoom: 18, zoomSnap: .25, maxBounds: [[42.85, -3.60], [43.60, -2.25]],
          maxBoundsViscosity: .8, scrollWheelZoom: false, zoomControl: false,
          fadeAnimation: !matchMedia('(prefers-reduced-motion: reduce)').matches,
          zoomAnimation: !matchMedia('(prefers-reduced-motion: reduce)').matches
        });
        if (!cached && !focus && !destination && state.view !== 'event') record.map.fitBounds(BIZKAIA_BOUNDS, { padding: [20, 20], animate: false });
        L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar el mapa', zoomOutTitle: 'Alejar el mapa' }).addTo(record.map);
        L.control.scale({ imperial: false, position: 'topleft', maxWidth: 80 }).addTo(record.map);
        record.map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noreferrer">Leaflet</a>');
        record.map.attributionControl.addAttribution(ATTRIBUTION);
        record.zones = L.layerGroup();
        record.environment = L.layerGroup().addTo(record.map);
        if (record.pressure) record.zones.addTo(record.map);
        syncZones(record);
        syncEnvironment(record);
        syncMarkers(record);
        record.map.on('moveend zoomend', () => remember(record));
        record.map.on('zoomend', () => syncMarkers(record));
        record.base = L.maplibreGL({
          style: { version: 8, sources: {}, layers: [] },
          interactive: false, maxZoom: 18, canvasContextAttributes: { antialias: false },
          transformRequest: url => ({ url, credentials: 'same-origin', referrerPolicy: 'no-referrer' })
        }).addTo(record.map);
        record.gl = record.base.getMaplibreMap();
        record.gl.getContainer().setAttribute('aria-hidden', 'true');
        record.onError = event => mapError(record, 'No se ha cargado toda la cartografía. Comprueba la conexión y reintenta.', event.error);
        record.onIdle = () => ready(record);
        record.gl.on('error', record.onError);
        record.gl.on('idle', record.onIdle);
        record.onCommand = event => {
          const control = event.target.closest('[data-map-command]');
          if (!control || !wrapper.contains(control)) return;
          const command = control.dataset.mapCommand;
          if (command === 'destination' && destination) record.map.setView(destination.coordinates, 14, { animate: false });
          if (command === 'all') record.map.fitBounds(BIZKAIA_BOUNDS, { padding: [20, 20], animate: false });
          if (command === 'focus' && focus) record.map.setView(focus.coordinates, 16, { animate: false });
          if (command === 'retry') loadStyle(record);
        };
        record.onChange = event => {
          const layer = event.target.dataset.mapLayer;
          if (layer && Object.hasOwn(record.state.environmentLayers, layer)) {
            record.state.environmentLayers[layer] = event.target.checked;
            syncEnvironment(record);
            return;
          }
          if (event.target.dataset.mapCommand !== 'pressure') return;
          record.pressure = event.target.checked;
          if (record.pressure) record.zones.addTo(record.map);
          else record.zones.remove();
          remember(record);
        };
        wrapper.addEventListener('click', record.onCommand);
        wrapper.addEventListener('change', record.onChange);
        if ('ResizeObserver' in window) {
          record.observer = new ResizeObserver(() => {
            if (record.closed || !container.clientWidth || !container.clientHeight) return;
            record.map.invalidateSize({ animate: false, debounceMoveend: true });
            const size = record.base.getSize();
            const basemap = record.base.getContainer();
            if (basemap.style.width !== `${size.x}px` || basemap.style.height !== `${size.y}px`) {
              basemap.style.width = `${size.x}px`;
              basemap.style.height = `${size.y}px`;
              record.gl.resize();
            }
          });
          record.observer.observe(container);
        }
        loadStyle(record);
      } catch (error) {
        mapError(record, 'Este navegador no pudo iniciar el mapa. Activa la aceleración gráfica o usa un navegador actualizado.', error);
        wrapper.querySelector('[data-map-command="retry"]').hidden = true;
      }
    }
  }
  function appearance() {
    for (const record of live) {
      if (record.closed || !record.gl) continue;
      syncZones(record);
      syncEnvironment(record);
      if (record.theme !== theme()) loadStyle(record);
    }
  }
  function refresh() {
    for (const record of live) {
      if (record.closed || !record.map || !record.zones) continue;
      syncMarkers(record);
      syncZones(record);
      syncEnvironment(record);
    }
  }
  window.addEventListener('offline', () => {
    for (const record of live) mapError(record, 'Sin conexión al mapa. Puedes consultar los datos de ejemplo de la página.');
  });
  window.addEventListener('online', () => {
    for (const record of live) {
      if (record.failed && record.gl) setStatus(record, 'Conexión recuperada. Pulsa Reintentar para cargar la cartografía.', true);
    }
  });
  return Object.freeze({ mount, destroy, appearance, refresh });
})();
