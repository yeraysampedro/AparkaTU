(() => {
  'use strict';

  const M = AparkaModel;
  const main = document.getElementById('main');
  const modal = document.getElementById('modal');
  const storageKey = 'aparkatu.preferences.v1';
  const icons = {
    map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-9 13h6"/>',
    users: '<circle cx="9" cy="7" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4m1-17a3 3 0 0 1 0 6m2 3a6 6 0 0 1 3 5v3"/>',
    leaf: '<path d="M20 3c1 10-2 16-9 16a7 7 0 0 1-7-7C4 5 10 3 20 3ZM3 22 15 10"/>',
    access: '<circle cx="12" cy="3" r="2"/><path d="m4 8 8 2 8-2m-8 2v5m0 0-5 7m5-7 5 7"/>',
    train: '<rect x="5" y="2" width="14" height="17" rx="4"/><path d="M5 9h14m-7-7v7M7 19l-3 3m13-3 3 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>',
    car: '<path d="m3 10 3-6h12l3 6v9H3v-9Zm0 0h18M6 19v3m12-3v3M6 14h2m8 0h2"/>',
    bike: '<circle cx="5" cy="17" r="4"/><circle cx="19" cy="17" r="4"/><path d="m5 17 5-9 5 9H5m10 0-4-13H8m5 4h5l2 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Zm-5 10 3 3 7-7"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
    check: '<path d="m4 12 5 5L21 5"/>',
    sliders: '<path d="M4 3v18M12 3v18M20 3v18M1 8h6m2 8h6m2-10h6"/>',
    heat: '<path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Zm3-5v9m7-12h3m-3 5h3"/>',
    pin: '<path d="M20 9c0 7-8 13-8 13S4 16 4 9a8 8 0 0 1 16 0Z"/><circle cx="12" cy="9" r="3"/>',
    sound: '<path d="M3 9h4l5-5v16l-5-5H3V9Zm13-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16"/>',
    mute: '<path d="M3 9h4l5-5v16l-5-5H3V9Zm13 0 6 6m0-6-6 6"/>',
    offline: '<path d="m2 2 20 20M3 8a15 15 0 0 1 5-3m6-1a15 15 0 0 1 7 4M6 12a9 9 0 0 1 5-2m6 1 2 1m-9 5 2-1 2 1"/><circle cx="12" cy="21" r="1"/>',
    arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
    back: '<path d="M20 12H4m7-7-7 7 7 7"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>',
    chart: '<path d="M3 3v18h18M7 16v-5m5 5V7m5 9V4"/>',
    screen: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    settings: '<path d="m9 3-1 3-3 1 1 4-2 2 2 3 3-1 3 3 3-2 3 1 2-3-2-3 1-3-3-1-1-3Z"/><circle cx="12" cy="11" r="3"/>',
    target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8S3 8 5 3s7 5 7 5Zm0 0s9 0 7-5-7 5-7 5Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    moon: '<path d="M20.7 13A9 9 0 0 1 11 3.3 9 9 0 1 0 20.7 13Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    chat: '<path d="M21 11a9 9 0 0 1-9 9H4l-2 2v-11a9 9 0 0 1 19 0Z"/><path d="M7 9h9m-9 5h6"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4m3 0h3"/>',
    upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
  const e = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let storageWarning = '';
  let preferences = { ...M.DEFAULTS };
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!M.validPreferences(parsed)) throw new Error('Las preferencias guardadas no son válidas.');
      preferences = { ...M.DEFAULTS, ...parsed };
    }
  } catch (error) {
    console.warn('AparkaTu: no se pudieron cargar las preferencias.', error);
    storageWarning = 'No se pudieron cargar tus preferencias. Puedes usar la web sin guardarlas.';
  }
  const state = M.createState(preferences);
  let ticketPhoto = null;
  let photoGeneration = 0;
  let photoError = '';
  let photoLoading = false;
  const startTime = performance.now();
  const modeNames = { metro: 'P+R + Metro', car: 'Solo coche', bike: 'Bizkaibizi' };
  const observationNames = { free: 'Plaza libre', occupied: 'Plaza ocupada', verify: 'Lectura del sensor confirmada', incident: 'Incidencia del sensor o acceso' };
  const visionNames = { standard: 'Visión estándar', deuteranopia: 'Deuteranopía', protanopia: 'Protanopía', tritanopia: 'Tritanopía' };
  const views = {
    map: ['AurkiTU', renderMap], search: ['AurkiTU · Buscar', renderSearch], results: ['AurkiTU · Resultados', renderResults],
    parking: ['Detalle del aparcamiento', renderParking], profile: ['Mi perfil', renderProfile],
    compare: ['GidaTU', renderCompare], route: ['GidaTU · Mi ruta', renderRoute], drive: ['GidaTU · En camino', renderDrive],
    arrival: ['Has llegado', renderArrival], alerts: ['AurreraTU', renderAlerts], event: ['AurreraTU · Evento', renderEvent],
    heat: ['AurreraTU · Calor', renderHeat], report: ['PartekaTU', renderReport], pending: ['Reporte recibido', renderPending],
    validated: ['Reporte validado', renderValidated], rewards: ['SariTU', renderRewards], redeemed: ['SariTU · Canje completado', renderRedeemed],
    settings: ['Accesibilidad', renderSettings], reading: ['Lectura accesible', renderReading], privacy: ['Privacidad', renderPrivacy],
    connection: ['Estado de la información', renderConnection], location: ['Ubicación opcional', renderLocation],
    public: ['Panel público', renderPublic], impact: ['AurrezTU', renderImpact], welcome: ['Bienvenido', renderWelcome],
    sensor: ['Procedencia del dato', renderSensor], barik: ['Mi Barik', renderBarik],
    ticket: ['Acreditar P+R + Metro', renderTicket], 'ticket-status': ['Estado del justificante', renderTicketStatus],
    forum: ['PartekaTU · Foro', renderForum], thread: ['PartekaTU · Conversación', renderThread]
  };
  function button(label, action, options = {}) {
    const { kind = '', view = '', id = '', disabled = false, full = false, small = false, glyph = '' } = options;
    return `<button type="button" class="button ${kind} ${full ? 'full' : ''} ${small ? 'small' : ''}" data-action="${e(action)}"${view ? ` data-view="${e(view)}"` : ''}${id ? ` data-id="${e(id)}"` : ''}${disabled ? ' disabled' : ''}>${glyph ? icon(glyph) : ''}${e(label)}</button>`;
  }
  const goButton = (label, view, options = {}) => button(label, 'go', { ...options, view });
  function heading(title, subtitle, actions = '', eyebrow = '') {
    return `<div class="page-heading"><div>${eyebrow ? `<p class="eyebrow green module-name" style="margin-bottom:9px">${e(eyebrow)}</p>` : ''}<h1>${e(title)}</h1><p class="optional-detail">${e(subtitle)}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</div>`;
  }
  const back = (view = 'map', label = 'Volver') => `<button class="back-link" data-action="go" data-view="${e(view)}">${icon('back')}${e(label)}</button>`;
  function card(tone, label, title, text, foot = '', action = '') {
    return `<section class="card ${tone}"><div class="eyebrow">${e(label)}</div><h3>${e(title)}</h3><p>${e(text)}</p>${foot ? `<span class="meta">${e(foot)}</span>` : ''}${action}</section>`;
  }
  function banner(title, text, glyph = 'info', tone = '', action = '') {
    return `<div class="banner ${tone}">${icon(glyph)}<div><strong>${e(title)}</strong><p>${e(text)}</p></div>${action}</div>`;
  }
  function metric(value, label, foot, glyph = '', comparison = '') {
    return `<div class="metric${comparison ? ' metric-with-comparison' : ''}">${glyph ? `<div class="metric-icon">${icon(glyph)}</div>` : ''}${comparison ? `<div class="metric-value"><b>${e(value)}</b><span class="metric-comparison">(${e(comparison)})</span></div>` : `<b>${e(value)}</b>`}<span>${e(label)}</span><small>${e(foot)}</small></div>`;
  }
  function option(title, detail, glyph, action, view = '', end = '') {
    return `<button class="option-row" data-action="${e(action)}"${view ? ` data-view="${e(view)}"` : ''}>${icon(glyph)}<div><strong>${e(title)}</strong><small>${e(detail)}</small></div><span class="end">${end ? e(end) : icon('chevron')}</span></button>`;
  }
  function toggle(name, title, detail, checked) {
    return `<label class="toggle"><span><strong>${e(title)}</strong><small>${e(detail)}</small></span><input type="checkbox" name="${e(name)}"${checked ? ' checked' : ''}></label>`;
  }
  function selectField(name, title, options, value) {
    return `<label class="field">${e(title)}<select name="${e(name)}">${options.map(([key, label]) => `<option value="${e(key)}"${String(value) === String(key) ? ' selected' : ''}>${e(label)}</option>`).join('')}</select></label>`;
  }
  const chip = (label, active = false) => `<span class="chip${active ? ' active' : ''}">${e(label)}</span>`;
  const time = M.formatTime;
  const ageText = M.formatAge;
  function freshness(parking) {
    const r = M.reading(parking, state);
    return `<span data-age="${e(parking.id)}">${e(time(r.updatedAt))} · hace ${e(ageText(r.ageMs))} · ${e(parking.source)}</span>`;
  }
  function selectedParking() {
    return M.PARKINGS.find(p => p.id === state.selectedParking) || M.PARKINGS[0];
  }
  function sensorInfo(parking, withLink = true) {
    return `<section class="sensor-info"><span class="sensor-id">${e(parking.sensor.id)}</span><h3>${e(parking.sensor.device)}</h3><p>${e(parking.sensor.location)}</p><span class="meta">${freshness(parking)}</span><span class="meta">Ubicación física simulada para este ejemplo, no una instalación verificada.</span>${withLink ? button('Ver procedencia del dato', 'sensor', { id: parking.id, kind: 'quiet', small: true, glyph: 'pin' }) : ''}</section>`;
  }
  function renderSensor() {
    const p = selectedParking();
    const r = M.reading(p, state);
    return back('parking', 'Volver al aparcamiento') + heading('El dato tiene un origen.', 'Conoce qué dispositivo lo produce y dónde está ubicado en este escenario.')
      + `<div class="split"><section class="panel panel-pad"><div class="eyebrow green">TRAZABILIDAD DEL SENSOR</div><h2 style="margin-top:12px">${e(p.sensor.id)}</h2><dl class="sensor-details"><dt>Infraestructura</dt><dd>${e(p.name)}</dd><dt>Ubicación física</dt><dd>${e(p.sensor.location)}</dd><dt>Dispositivo</dt><dd>${e(p.sensor.device)}</dd><dt>Cobertura</dt><dd>${e(p.sensor.coverage)}</dd><dt>Última lectura</dt><dd>${freshness(p)}</dd><dt>Estado</dt><dd>${r.available === null ? 'Desconocido · dato no válido' : 'Lectura reciente · disponibilidad orientativa'}</dd></dl>${banner('Localización de referencia, no verificada.', 'Los identificadores y ubicaciones son ficticios. Un servicio real debe publicar el inventario de sensores del operador.', 'info', 'neutral')}</section><div class="stack"><section class="panel map-panel">${mapMarkup(false, true)}${mapLegend()}</section>${button('Contrastar este sensor', 'go', { view: 'report', kind: 'green', full: true, glyph: 'users' })}${card('unknown', 'MISMO CRITERIO EN TODA LA WEB', 'Caducado sigue siendo desconocido.', 'Identificar el sensor no convierte una lectura antigua en disponibilidad ni reserva una plaza.')}</div></div>`;
  }
  function connectionBanner() {
    if (state.dataMode === 'fresh' && M.PARKINGS.some(p => M.reading(p, state).available !== null)) return '';
    return `<div style="margin-bottom:20px">${banner(state.dataMode === 'offline' ? 'Sin conexión a la información' : 'Las lecturas ya no son válidas', 'La disponibilidad figura como desconocida. No usamos datos antiguos como plazas libres.', 'offline', 'unknown', button('Actualizar', 'refresh', { kind: 'secondary', small: true, glyph: 'refresh' }))}</div>`;
  }
  function parkingRow(parking, publicView = false) {
    const r = M.parkingStatus(parking, state);
    const fresh = r.available !== null;
    const compatibility = M.compatible(parking, state.preferences);
    return `<article class="parking-row"><div class="parking-icon">${parking.type === 'pr' ? 'P+R' : 'P'}</div><div class="parking-info"><h3>${e(parking.name)}</h3><p>${publicView ? e(parking.connection) : `${parking.pmr} PMR · ${parking.walk} m a pie${compatibility ? ' · compatible' : ' · revisa acceso'}`}</p><span class="meta">${freshness(parking)}</span></div><div class="availability ${r.kind}"><strong>${fresh ? r.available : '?'}</strong><small>${e(r.label)}</small></div>${publicView ? '' : `<button class="icon-button" data-action="parking" data-id="${e(parking.id)}" aria-label="Ver ${e(parking.name)}">${icon('chevron')}</button>`}</article>`;
  }
  function mapMarkup(interactive = true, compact = false) {
    const focus = ['parking', 'sensor'].includes(state.view) ? state.selectedParking : '';
    const key = focus ? `${state.view}:${focus}` : state.view;
    return `<section class="geographic-map${compact ? ' compact-map' : ''}" data-leaflet-map data-map-key="${e(key)}" data-map-focus="${e(focus)}" data-map-parkings="${interactive}" data-map-status="loading" aria-label="Mapa de Bilbao y Leioa">
      <div class="geographic-map-tools" role="group" aria-label="Controles de cartografía">
        <button type="button" data-map-command="bilbao">Bilbao</button>
        <button type="button" data-map-command="all">Bilbao y Leioa</button>
        ${focus ? '<button type="button" data-map-command="focus">Centrar aparcamiento</button>' : ''}
        <label><input type="checkbox" data-map-command="pressure" checked> Presión · ejemplo</label>
      </div>
      <details class="environment-filters"${Object.values(state.environmentLayers).some(Boolean) ? ' open' : ''}>
        <summary><strong>BateraTU</strong><span>Refugios, aire y recorridos a la sombra</span></summary>
        <div class="environment-options">
          ${[['refuges', 'Refugios climáticos'], ['air', 'Calidad del aire'], ['shade', 'Itinerarios sombreados']].map(([key, label]) => `<label><input type="checkbox" data-map-layer="${key}"${state.environmentLayers[key] ? ' checked' : ''}>${label}</label>`).join('')}
        </div><p>Capas de ejemplo. Sombra y accesos no verificados; las cifras de aire no son mediciones reales.</p>
        <div class="environment-key"><span>R · Refugio</span><span>A · PM₂.₅ en µg/m³</span><span>Trazo discontinuo · Paseo a la sombra</span></div>
      </details>
      <div class="live-map" role="region" aria-label="Mapa interactivo. Usa los botones más y menos para cambiar el zoom y las flechas para desplazarte." tabindex="0"></div>
      <div class="geographic-map-status"><span data-map-status role="status">Cargando cartografía…</span><button type="button" data-map-command="retry" hidden>Reintentar</button></div>
      <p class="geographic-map-note">Calles de OpenStreetMap. Plazas, sensores y zonas de presión de ejemplo. Los marcadores indican ubicaciones aproximadas.</p>
    </section>`;
  }
  const mapLegend = () => `<div class="map-legend"><div class="legend-items"><span><i class="legend-dot"></i>Baja presión</span><span><i class="legend-triangle"></i>Alta presión</span><span><i class="legend-square"></i>Desconocido</span></div><span class="pressure-spectrum" aria-hidden="true"></span><span>Predicción simulada, no garantía</span></div>`;
  function searchbar() {
    return `<form id="destination-form" class="searchbar">${icon('search')}<div class="search-field"><label for="destination">¿DÓNDE QUIERES APARCAR?</label><input id="destination" name="destination" value="${e(state.destination)}" placeholder="Una dirección, barrio o destino" maxlength="100" required></div><div class="divider"></div><span class="location-hint">${icon('pin')} ${e(state.origin)}</span><button class="button" type="submit">Buscar ${icon('arrow')}</button></form>`;
  }
  function renderMap() {
    const alternatives = M.journeyOptions(state);
    const recommended = alternatives[0];
    const all = M.results(state);
    return heading('Encuentra aparcamiento en Bilbao y Leioa.', 'Revisa el estado, el sensor y la antigüedad de cada lectura.', button('Mis preferencias', 'go', { view: 'profile', kind: 'secondary', glyph: 'access' }), 'AurkiTU · Encontrar')
      + connectionBanner() + searchbar()
      + `<div class="map-layout"><div class="stack"><section class="panel map-panel"><div class="map-filters"><div class="chips"><button class="chip active" data-action="refresh">${icon('clock')} Ahora</button><button class="chip${state.preferences.pmr ? ' active' : ''}" data-action="filters">${icon('access')} PMR</button><button class="chip${state.preferences.preferPr ? ' active' : ''}" data-action="filters">P+R</button><button class="chip" data-action="filters">${icon('sliders')} Filtros</button></div><span class="time-pill">${icon('clock')}<span data-clock>${time(state.now).slice(0, 5)}</span> · ejemplo</span></div>${mapMarkup()}${mapLegend()}</section>
        <div class="section-title" style="margin-top:7px"><h2>Opciones que encajan contigo</h2><button class="mini-link" data-action="go" data-view="results" style="margin:0">Ver todas ${icon('arrow')}</button></div><div class="parking-list">${all.length ? all.slice(0, 2).map(p => parkingRow(p)).join('') : emptyResults()}</div></div>
        <aside class="stack map-side"><section class="card positive route-recommendation"><div class="recommendation-head">${icon('train')} GidaTU</div><h3>Alternativa recomendada</h3>
        <div class="big-time">${recommended.duration} <small>min · ${modeNames[recommended.mode]}</small></div>
        <div class="mode-summary">${alternatives.map(r => `<button class="mode-block mode-${r.mode}${r.mode === recommended.mode ? ' fastest' : ''}" data-action="select-route" data-id="${r.mode}">${icon(r.mode === 'metro' ? 'train' : r.mode)}<span>${modeNames[r.mode]}</span><strong>${r.duration} min</strong>${r.mode === recommended.mode ? '<small>Más rápida</small>' : ''}</button>`).join('')}</div>
        ${goButton('Comparar recorridos', 'compare', { kind: 'green', full: true, glyph: 'arrow' })}<p class="footnote" style="margin-top:13px">Incluye búsqueda y tramo a pie. Tiempos simulados para Getxo → San Mamés; no reserva plazas.</p></section>
        <section class="card warning preventive-alert"><div class="card-icon"><span class="eyebrow module-name">AurreraTU · Aviso preventivo</span>${icon('bell')}</div><h3>Alta ocupación: evento en San Mamés.</h3><p>Previsión de presión alta de 18:00 a 19:00. Considera un P+R antes de entrar en la zona.</p><button class="mini-link" data-action="go" data-view="event">Ver alternativas ${icon('arrow')}</button></section>
        <section class="panel panel-pad quick-community"><div class="eyebrow green module-name">PartekaTU</div><h3>Red Colaborativa</h3>${reportForm(true)}${goButton('Abrir el foro vecinal', 'forum', { kind: 'quiet', full: true, glyph: 'chat' })}</section></aside></div>`;
  }
  function renderSearch() {
    return back() + heading('Tu próximo destino.', 'Busca en Bizkaia sin guardar un historial de tus trayectos.')
      + `<div class="wide-narrow">${searchbar()}<div class="two-col"><section class="panel panel-pad stack"><h3 style="margin:0">Lugares que quizá buscas</h3>${['San Mamés', 'Hospital de Basurto', 'Casco Viejo'].map((name, i) => `<button class="option-row" data-action="destination" data-id="${e(name)}">${icon(i === 1 ? 'access' : 'pin')}<div><strong>${e(name)}</strong><small>Bilbao · destino de ejemplo</small></div>${icon('chevron')}</button>`).join('')}</section><div class="stack">${card('', 'SIN RASTREO', 'Tu búsqueda se queda aquí.', 'Origen y destino solo se mantienen durante esta visita. No pedimos una cuenta ni guardamos tus desplazamientos.', '', goButton('Elegir origen manualmente', 'location', { kind: 'secondary', small: true }))}${card('positive', 'ANTES QUE LA DISTANCIA', 'Primero, que sea compatible.', 'Tus condiciones de acceso, PMR y preferencias de movilidad acompañan cada búsqueda.')}</div></div></div>`;
  }
  function emptyResults() {
    return `<section class="panel empty-state"><div class="empty-icon">${icon('search')}</div><h2>No hay opciones compatibles.</h2><p>No hemos desactivado tus necesidades de accesibilidad. Puedes ampliar la distancia a pie o revisar otros filtros.</p><div class="row">${button('Revisar filtros', 'filters', { glyph: 'sliders' })}${goButton('Buscar otro destino', 'search', { kind: 'secondary' })}</div></section>`;
  }
  function renderResults() {
    const parkings = M.results(state);
    return back() + heading(`Tu sitio cerca de ${state.destination}.`, `${parkings.length} opciones de ejemplo compatibles con tus preferencias.`, button('Filtrar resultados', 'filters', { kind: 'secondary', glyph: 'sliders' }))
      + connectionBanner() + `<div class="split"><section class="stack">${banner('No todo es llegar en coche.', 'Compara el tiempo total, incluida la búsqueda y el último tramo a pie.', 'train', 'neutral')}${parkings.length ? `<div class="parking-list">${parkings.map(p => parkingRow(p)).join('')}</div>` : emptyResults()}<p class="footnote">Catálogo local de ejemplo de Bilbao y su entorno. Esta web no consulta una base de datos geográfica ni disponibilidad en vivo.</p></section><div class="stack"><section class="panel map-panel">${mapMarkup(true, true)}${mapLegend()}</section>${goButton('Comparar coche, Metro y bici', 'compare', { kind: 'green', full: true, glyph: 'arrow' })}</div></div>`;
  }
  function renderParking() {
    const p = selectedParking();
    const r = M.reading(p, state);
    const compatible = M.compatible(p, state.preferences);
    const freshnessCard = (r.available === null
      ? card('unknown', 'DESCONOCIDO · NO EQUIVALE A LIBRE', 'No podemos confirmar si hay plazas.', 'La lectura no es válida o no hay conexión. No mostramos la última cifra como disponibilidad.', '', `<div class="footnote" style="margin-top:14px">${freshness(p)}</div>`)
      : r.available === 0
        ? card('danger', 'COMPLETO · ÚLTIMA LECTURA', 'No se indican plazas disponibles.', 'El sensor muestra cero plazas en este escenario. Busca otra opción antes de desplazarte.', '', `<div class="footnote" style="margin-top:14px">${freshness(p)}</div>`)
        : card('positive', 'LECTURA RECIENTE', 'Disponibilidad orientativa.', `Rango orientativo: ${Math.max(0, p.spaces - p.margin)}–${p.spaces + p.margin} plazas. La ocupación puede cambiar antes de que llegues.`, '', `<div class="footnote" style="margin-top:14px">${freshness(p)}</div>`)) + sensorInfo(p);
    return back('results', 'Volver a los aparcamientos') + heading(p.name, p.connection, `<span class="chip ${compatible ? 'active' : 'red'}">${compatible ? 'Compatible con tu perfil' : 'Revisa las condiciones de acceso'}</span>`)
      + `<div class="split"><div class="stack"><section class="panel map-panel">${mapMarkup(false)}${mapLegend()}</section>${banner('Una plaza indicada no queda reservada.', 'Confirma tarifas, horarios, plazas PMR y señalización con el operador.', 'info', 'neutral')}</div><div class="stack"><div class="metrics two">${metric(r.available === null ? '?' : r.available, r.available === null ? 'Disponibilidad desconocida' : 'Plazas orientativas', r.available === null ? 'Lectura no válida' : `Margen estimado ±${p.margin}`)}${metric(p.pmr, 'Plazas PMR de referencia', 'Confirma al llegar')}</div>${freshnessCard}<section class="panel panel-pad"><h3>Antes de llegar</h3><div class="stack tight"><span class="row">${icon('access')} <span class="small">${p.stepFree ? 'Acceso sin escalones · ejemplo' : 'Consultar barreras de acceso'}</span></span><span class="row">${icon('pin')} <span class="small">${p.walk} m de recorrido a pie</span></span><span class="row">${icon('shield')} <span class="small">${p.residentOnly ? 'Requiere autorización de residente' : 'PMR: requiere tarjeta acreditativa'}</span></span></div></section>${compatible ? button(r.available === null ? 'Ver alternativas con datos válidos' : 'Comparar cómo llegar', 'go', { view: r.available === null ? 'results' : 'compare', full: true, kind: 'green', glyph: 'arrow' }) : button('Revisar mi perfil', 'go', { view: 'profile', full: true, kind: 'secondary' })}${button('Informar sobre esta plaza', 'go', { view: 'report', full: true, kind: 'secondary', glyph: 'users' })}</div></div>`;
  }
  function profileFields() {
    const p = state.preferences;
    return toggle('pmr', 'Necesito una plaza PMR', 'Se requiere tarjeta acreditativa en destino.', p.pmr)
      + toggle('stepFree', 'Prefiero rutas sin escalones', 'También en los tramos a pie y transbordos.', p.stepFree)
      + toggle('resident', 'Tengo autorización de residente', 'Para las zonas reguladas que la requieran.', p.resident)
      + `<div class="form-grid" style="margin-top:18px">${selectField('vehicle', 'Distintivo del vehículo', [['B', 'B'], ['C', 'C'], ['ECO', 'ECO'], ['0', 'Cero emisiones']], p.vehicle)}${selectField('maxWalk', 'Distancia máxima a pie', [[50, 'Hasta 50 m'], [100, 'Hasta 100 m'], [300, 'Hasta 300 m'], [600, 'Hasta 600 m']], p.maxWalk)}</div>`;
  }
  function renderProfile() {
    return heading('Mi perfil', 'Preferencias de acceso y actividad de esta visita.')
      + `<div class="split"><div class="stack"><form id="profile-form" class="panel panel-pad"><h2>Condiciones de acceso</h2>${profileFields()}<div class="form-actions">${goButton('Cancelar', 'map', { kind: 'secondary' })}<button class="button" type="submit">Guardar preferencias ${icon('check')}</button></div></form>${personalImpactPanel()}</div>
      <div class="stack">${card('positive', 'PRIVACIDAD', 'Preferencias guardadas en tu navegador.', 'No guardamos origen, destino, reportes ni trayectos individuales.')}${option('SariTU · Mis puntos', 'Consultar saldo, acreditaciones y canjes Barik.', 'leaf', 'go', 'rewards')}${option('Accesibilidad', 'Colores, tipografía e interlineado.', 'access', 'go', 'settings')}${option('Usar sin ubicación', 'Elige tu punto de partida manualmente.', 'pin', 'manual-location')}${banner('Comprueba las condiciones en destino.', 'Los accesos de este catálogo son ejemplos. Confirma la señalización y las condiciones con el operador.', 'info', 'neutral')}</div></div>`;
  }
  function personalImpactPanel() {
    const impact = M.personalImpact(state);
    const count = impact.tickets;
    const next = [1, 3, 5].find(target => target > count) || (Math.floor(count / 5) + 1) * 5;
    const equivalence = M.MOBILITY_EQUIVALENCE;
    const co2PerTicket = equivalence.co2Kg.toLocaleString('es-ES');
    const co2PerPoint = (equivalence.co2Kg / equivalence.points).toLocaleString('es-ES', { maximumFractionDigits: 4 });
    return `<section class="panel panel-pad personal-impact"><div class="eyebrow green module-name">AurrezTU · Ahorrar</div><h2 style="margin-top:10px">Tu ahorro estimado</h2><p class="small muted">Se calcula con los justificantes intermodales validados durante esta visita.</p>
      <div class="metrics two">${metric(`${impact.minutes} min`, 'Tiempo de búsqueda evitado', `${equivalence.minutes} min por acreditación · ejemplo`)}${metric(`${impact.co2Kg.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kg`, 'CO₂ equivalente evitado', 'Estimación, no medición')}
      ${metric(`${impact.mobilityPoints} PTS`, 'Puntos por intermodalidad', 'Acumulados antes de canjear')}${metric(count, 'Justificantes validados', 'No incluye reportes ciudadanos')}</div>
      <div class="impact-equivalence"><strong>${equivalence.points} PTS de movilidad ≈ ${co2PerTicket} kg de CO₂</strong><p>Factor ilustrativo de esta demo: ${co2PerPoint} kg por punto intermodal. No es una equivalencia oficial de Barik. Los puntos iniciales y los reportes no cuentan como ahorro de emisiones; canjear puntos no borra el acumulado.</p></div>
      <div class="impact-milestones" aria-label="Hitos de intermodalidad">${[[1, 'Primer justificante'], [3, 'Tres usos acreditados'], [5, 'Cinco usos acreditados']].map(([target, label]) => `<span class="milestone${count >= target ? ' achieved' : ''}">${icon(count >= target ? 'check' : 'clock')}${label}<small>${count >= target ? 'Completado' : `${Math.min(count, target)} de ${target}`}</small></span>`).join('')}</div>
      <label class="field milestone-progress">Progreso: ${count} de ${next} acreditaciones<progress max="${next}" value="${Math.min(count, next)}">${count} de ${next}</progress></label>
      ${goButton('Ver el impacto agregado en AurrezTU', 'impact', { kind: 'quiet', full: true, glyph: 'chart' })}</section>`;
  }
  function renderCompare() {
    const alternatives = M.journeyOptions(state);
    const fastest = alternatives[0];
    const savings = M.journey('car', state.departure).duration - fastest.duration;
    const routeCards = alternatives.map(r => {
      const mode = r.mode;
      const descriptions = {
        metro: '8 min conduciendo + 2 para aparcar + 17 en Metro + 4 a pie.',
        car: `23 min conduciendo + ${r.steps[1].minutes} buscando plaza + 6 a pie.`,
        bike: '34 min pedaleando + 2 a pie. Bizkaibizi: recorrido de referencia; bicicletas y estaciones no verificadas.'
      };
      return `<article class="panel route-card mode-${mode}${mode === fastest.mode ? ' recommended' : ''}">${mode === fastest.mode ? '<span class="route-tag">ALTERNATIVA MÁS RÁPIDA</span>' : ''}<div class="mode-symbol">${icon(mode === 'metro' ? 'train' : mode)}</div><h3>${modeNames[mode]}</h3><div class="route-time">${r.duration} <span>min</span></div><span class="small muted">Llegada ${r.arrival} · margen ±${r.uncertainty} min</span><p class="small muted" style="margin-top:20px">${descriptions[mode]}</p>${mode !== 'car' ? `<span class="benefit">${icon('leaf')} ${mode === 'metro' ? '+30 puntos al validar ticket P+R y Barik · ejemplo' : 'Movilidad activa, sin puntos automáticos'}</span>` : '<span class="footnote" style="margin-bottom:15px">Incluye búsqueda: no solo conducción.</span>'}${button(`Elegir ${modeNames[mode]}`, 'select-route', { id: mode, kind: mode === 'metro' ? 'green' : mode === 'bike' ? 'blue' : 'secondary', full: true, glyph: 'arrow' })}</article>`;
    }).join('');
    return heading('Compara cómo llegar.', 'Tiempo total de conducción, búsqueda, transporte público y tramo a pie.', goButton('Cambiar destino', 'search', { kind: 'secondary', glyph: 'pin' }), 'GidaTU · Guiar')
      + connectionBanner() + `<div class="panel panel-pad" style="margin-bottom:22px"><form id="departure-form" class="row" style="justify-content:space-between"><div class="row">${icon('pin')}<strong style="font-size:13px">${e(state.origin)} → ${e(state.destination)}</strong><span class="chip">Recorrido de referencia</span></div><div class="row"><label class="field" style="display:flex;align-items:center;gap:10px">Salida <input type="time" name="departure" value="${e(state.departure)}" required style="width:110px"></label><button class="button secondary small" type="submit">Actualizar</button></div></form></div>`
      + `<div style="margin-bottom:22px">${banner(`${modeNames[fastest.mode]}: ${fastest.duration} min en total.`, savings > 0 ? `${savings} minutos menos que ir solo en coche en este escenario.` : 'Es la alternativa de menor duración en este escenario.', 'clock', 'neutral')}</div><div class="three-col">${routeCards}</div><p class="footnote" style="margin-top:21px">Duraciones simuladas para Getxo → San Mamés. No se recalculan geográficamente para otras direcciones. Se prioriza la menor duración; no se garantiza una plaza ni la disponibilidad de Bizkaibizi.</p>`;
  }
  function renderRoute() {
    const r = M.journey(state.selectedMode, state.departure);
    const done = state.completedModes.includes(state.selectedMode);
    return back('compare', 'Cambiar alternativa') + heading('Tu camino, paso a paso.', `${modeNames[state.selectedMode]} · ${state.origin} → ${state.destination}`, `<span class="chip active">${icon('access')} Recorrido accesible de referencia</span>`)
      + `<div class="split"><section class="panel panel-pad"><div class="panel-head" style="padding:0 0 15px"><h2>Así llegas</h2><span class="chip">${r.duration} min · ${r.arrival}</span></div><div class="itinerary">${r.steps.map((s, i) => `<div class="route-step"><div class="step-icon">${icon(s.icon)}</div><div><h3>${i + 1}. ${e(s.label)}</h3><p>${i === 1 && state.selectedMode === 'metro' ? 'Confirma una plaza al llegar. No está reservada.' : i === 2 && state.selectedMode === 'metro' ? 'Frecuencias y ascensores: confirmar con Metro Bilbao.' : 'Trayecto orientativo de ejemplo.'}</p></div><span class="step-time">${s.minutes} min</span></div>`).join('')}</div></section><div class="stack"><div class="metrics two">${metric(r.duration + ' min', 'Tiempo total', `Variación estimada ±${r.uncertainty} min`)}${metric(r.arrival, 'Llegada orientativa', 'No es navegación real')}</div>${banner('Confirma la accesibilidad antes de salir.', 'El estado de los ascensores y las condiciones de acceso pueden cambiar.', 'access', 'neutral')}${state.dataMode !== 'fresh' ? banner('No hay disponibilidad confirmada.', 'La ruta es orientativa; los datos de aparcamiento figuran como desconocidos.', 'offline', 'unknown') : ''}${state.selectedMode !== 'bike' ? button('Iniciar recorrido', 'start-drive', { kind: 'green', full: true, glyph: 'arrow' }) : ''}${button(done ? 'Recorrido ya completado' : 'He llegado · finalizar recorrido', 'complete-journey', { kind: 'secondary', full: true, disabled: done, glyph: 'check' })}<p class="footnote">La web no accede al GPS, no guarda trayectos y no proporciona indicaciones de navegación reales.</p></div></div>`;
  }
  function renderDrive() {
    if (!state.moving) return renderRoute();
    return heading('Ahora, la atención en la vía.', 'Las acciones de comunidad y el resto de pantallas están pausadas.')
      + `<div class="split"><section class="drive-view"><div class="eyebrow">RECORRIDO ORIENTATIVO · SIN GPS</div><div class="row" style="justify-content:space-between"><div><div class="drive-distance">600 m</div><h2>Salida hacia<br>${state.selectedMode === 'metro' ? 'P+R Leioa' : 'tu destino'}</h2></div><span class="direction-icon">${icon('arrow')}</span></div><p>Ejemplo visual. Sigue la señalización real y no interactúes mientras conduces.</p></section><div class="stack"><div class="metrics two">${metric('8 min', 'Hasta el siguiente tramo', 'Estimación de ejemplo')}${metric(M.journey(state.selectedMode, state.departure).arrival, 'Llegada final', 'Trayecto orientativo')}</div>${banner('Los reportes pueden esperar.', 'No se muestran formularios ni se permite enviar información en marcha.', 'shield', 'neutral')}${button(state.muted ? 'Activar voz' : 'Silenciar voz', 'toggle-voice', { kind: 'secondary', full: true, glyph: state.muted ? 'mute' : 'sound' })}${button('Estoy parado · volver a mi ruta', 'stop-drive', { kind: 'green', full: true })}<p class="footnote">La voz, si está disponible en el navegador, solo lee un aviso de seguridad de ejemplo.</p></div></div>`;
  }
  function renderArrival() {
    return `<div class="narrow"><section class="panel empty-state"><div class="success-symbol">${icon('check')}</div><div class="eyebrow green">RECORRIDO COMPLETADO</div><h1 style="margin-top:15px">Ya estás donde querías.</h1><p>Gracias por elegir cómo moverte con más calma. Finalizar un recorrido no acredita su uso ni suma puntos automáticamente.</p>${state.selectedMode === 'metro' ? `<p>Para sumar 30 puntos de ejemplo, vincula tu Barik personalizada y presenta la fotografía del ticket del parking disuasorio.</p>` : ''}<div class="row">${state.selectedMode === 'metro' ? goButton('Acreditar P+R + Metro', state.barik ? 'ticket' : 'barik', { kind: 'green', glyph: 'upload' }) : goButton('Ver mi movilidad', 'rewards', { kind: 'green', glyph: 'leaf' })}${goButton('Volver a explorar', 'map', { kind: 'secondary' })}</div><p class="footnote" style="margin-top:22px">No se ha registrado ni validado un trayecto real.</p></section></div>`;
  }
  function renderAlerts() {
    return heading('Avisos antes de llegar.', 'Eventos y calor que pueden afectar a tu trayecto.', goButton('Preferencias de avisos', 'settings', { kind: 'secondary', glyph: 'sliders' }), 'AurreraTU · Anticipar')
      + (!state.preferences.alerts ? `<div style="margin-bottom:20px">${banner('Los avisos preventivos están desactivados.', 'Puedes consultar manualmente los avisos de ejemplo de esta página.', 'bell', 'neutral')}</div>` : '')
      + `<div class="two-col">${card('danger', 'EVENTO · PRESIÓN ALTA', 'San Mamés: decide antes de llegar.', 'Se esperan más llegadas entre 18:00 y 19:00. Aparcar fuera del núcleo y continuar en Metro puede ahorrarte tiempo.', 'Fuente: agenda de ejemplo · previsión con confianza media', goButton('Ver alternativas por evento', 'event', { kind: 'secondary', full: true, glyph: 'arrow' }))}${card('warning', 'CLIMA · CALOR EXTREMO', 'Una ruta con menos exposición.', '38 °C en el escenario de ejemplo. Prioriza sombra, paradas cubiertas y recorridos cortos a pie.', 'Fuente: clima de ejemplo · no es un aviso meteorológico vigente', goButton('Ver recomendaciones por calor', 'heat', { kind: 'secondary', full: true, glyph: 'arrow' }))}</div><div style="margin-top:24px">${banner('Avisos locales, sin seguir tus pasos.', 'El concepto procesa las alertas en el dispositivo. Esta versión no solicita permisos de ubicación ni utiliza notificaciones externas.', 'shield', 'neutral')}</div>`;
  }
  function renderEvent() {
    return back('alerts', 'Todos los avisos') + heading('San Mamés, con un poco más de calma.', 'Aviso preventivo por evento · decide antes de entrar en Bilbao.')
      + `<div class="split"><div class="stack">${card('danger', 'ENTRE LAS 18:00 Y LAS 19:00', 'Se prevé presión alta en el entorno.', 'Las llegadas concentradas pueden aumentar el tiempo de búsqueda. La predicción orienta; no garantiza lo que ocurrirá.', 'Agenda de ejemplo · confianza predictiva media')}<section class="panel map-panel">${mapMarkup(false)}${mapLegend()}</section></div><div class="stack">${card('positive', 'ALTERNATIVA RECOMENDADA', 'P+R Leioa + Metro', 'Aparca fuera de la zona de presión y termina el recorrido en transporte público.', '31 min orientativos · 16 min menos que solo coche', button('Elegir P+R + Metro', 'select-route', { id: 'metro', kind: 'green', full: true, glyph: 'train' }))}${card('', 'OTRA FRANJA', 'Salir a las 19:15.', 'En el escenario de ejemplo, disminuye la búsqueda de aparcamiento. Puedes comparar la nueva hora.', 'Menor presión prevista, no disponibilidad garantizada', button('Comparar salida a las 19:15', 'later-departure', { kind: 'secondary', full: true, glyph: 'clock' }))}${goButton('Ver todas las alternativas', 'compare', { kind: 'secondary', full: true })}</div></div>`;
  }
  function renderHeat() {
    return back('alerts', 'Todos los avisos') + heading('Muévete sin pasar tanto calor.', 'Menos exposición. Más sombra. Una alternativa cuando la necesitas.')
      + `<div class="split"><div class="stack"><div class="metrics two">${metric('38 °C', 'Temperatura de ejemplo', 'Escenario de calor extremo', 'heat')}${metric('31 min', 'Con P+R + Metro', 'Menos trayecto expuesto', 'train')}</div>${card('warning', 'CUIDAR TAMBIÉN ES MOVILIDAD', 'Busca el recorrido más fresco.', 'Las olas de calor afectan especialmente a personas mayores y otros perfiles vulnerables. Evita la exposición prolongada y consulta avisos oficiales.', 'Las temperaturas de esta web son simuladas')}<section class="panel panel-pad"><h3>Una pausa a la sombra</h3><p class="muted small">Parque de Doña Casilda · oasis térmico de referencia</p><div class="row"><span class="chip active">${icon('leaf')} Infraestructura verde</span><span class="chip">${icon('access')} Revisar accesos</span></div><p class="footnote" style="margin-top:15px">No se confirma en tiempo real el estado de fuentes, sombra o instalaciones.</p></section></div><div class="stack">${option('Priorizar Metro', 'Menos exposición durante el desplazamiento.', 'train', 'go', 'compare')}${option('Revisar mi ruta a pie', 'Mantén el recorrido dentro de tus preferencias.', 'access', 'go', 'profile')}${option('Reconsiderar la bici', 'Compara alternativas durante el pico térmico.', 'bike', 'go', 'compare')}${goButton('Elegir una alternativa más fresca', 'compare', { kind: 'green', full: true, glyph: 'arrow' })}</div></div>`;
  }
  function reportForm(compact = false) {
    const observations = [['free', '🅿 Plaza libre'], ['occupied', '⛔ Plaza ocupada'], ['verify', '✓ Confirmar lectura'], ['incident', '⚠ Incidencia del sensor o acceso']];
    return `<form id="${compact ? 'quick-report-form' : 'report-form'}" data-report-form class="form-stack${compact ? ' compact-report-form' : ' panel panel-pad'}">
      ${compact ? '' : '<h2>Red Colaborativa</h2>'}
      ${selectField('parking', 'Sensor y aparcamiento', M.PARKINGS.map(p => [p.id, `${p.sensor.id} · ${p.name}`]), state.selectedParking)}
      <div data-report-sensor>${compact ? `<p class="footnote">${e(selectedParking().sensor.location)} · ubicación de ejemplo</p>` : sensorInfo(selectedParking())}</div>
      ${selectField('observation', '¿Qué observas?', observations, 'free')}
      ${toggle('stopped', 'Estoy parado.', 'No envíes reportes mientras conduces.', false)}
      <p data-form-error class="inline-message" role="alert" hidden></p>
      <button class="button contrast full" type="submit">${icon('users')} Enviar y sumar puntos</button>
      <p class="footnote">+10 PTS solo después de validar. El envío no altera el dato del sensor ni acredita una plaza libre.</p>
    </form>`;
  }
  function renderReport() {
    return heading('Reportes y ayuda vecinal.', 'Contrasta sensores o consulta dudas y cesiones temporales en el foro.', goButton('Foro vecinal', 'forum', { kind: 'secondary', glyph: 'chat' }), 'PartekaTU · Compartir')
      + `<div class="split">${reportForm()}<div class="stack">
        ${card('positive', 'VALIDACIÓN DE REPORTES', 'Puntos después del contraste.', 'La observación se asocia a un sensor identificado. Los puntos se conceden al validar, no al pulsar enviar.', '+10 PTS de ejemplo por aportación validada')}
        ${option('SariTU · Acreditar uso intermodal', 'Vincula Barik y adjunta el ticket de un P+R.', 'card', 'go', state.barik ? 'ticket' : 'barik')}
        ${card('', 'REPORTES ANÓNIMOS', 'Tu observación no se vincula a Barik.', 'No incluyas nombres, matrículas ni datos personales. Los reportes se mantienen solo durante esta visita.')}
        ${state.reports.length ? `<section class="panel panel-pad"><h3>Mis aportaciones</h3>${state.reports.map(report => `<div class="transaction">${icon(report.validated ? 'check' : 'clock')}<div><strong>${e(observationNames[report.observation])}</strong><small>${e(report.sensorId)} · ${report.validated ? 'validado' : 'pendiente'}</small></div><span class="amount">${report.validated ? '+10 PTS' : '—'}</span>${!report.validated ? button('Ver', 'report-details', { id: report.id, kind: 'quiet', small: true }) : ''}</div>`).join('')}</section>` : ''}
        <section class="card"><div class="eyebrow">FORO LOCAL</div><h3>Plazas temporales, dudas e incidencias.</h3><p>Puedes escribir y responder en esta visita. Las publicaciones no salen del navegador y no representan reservas reales.</p>${goButton('Abrir PartekaTU · Foro', 'forum', { kind: 'secondary', full: true, glyph: 'arrow' })}</section></div></div>`;
  }
  function forumList() {
    const threads = state.forumThreads.filter(thread => state.forumCategory === 'all' || thread.category === state.forumCategory);
    if (!threads.length) return '<section class="panel panel-pad"><p class="muted">Todavía no hay temas en esta categoría durante esta visita.</p></section>';
    return [...threads].reverse().map(thread => `<article class="panel panel-pad forum-card">
      <div class="row"><span class="chip${thread.category === 'share' ? ' active' : ''}">${e(M.FORUM_CATEGORIES[thread.category])}</span><span class="small muted">${e(thread.zone)}</span>${thread.closed ? '<span class="chip gray">Cerrado</span>' : ''}</div>
      <h2><button class="thread-title" data-action="forum-thread" data-id="${thread.id}">${e(thread.title)}</button></h2>
      <p>${e(thread.message)}</p>${thread.availability ? `<p class="forum-availability">${icon('clock')} ${e(thread.availability)}</p>` : ''}
      <div class="forum-card-footer"><span>${thread.own ? 'Tu publicación local' : 'Publicación de ejemplo'} · ${thread.replies.length} respuesta${thread.replies.length === 1 ? '' : 's'}</span>${button(thread.category === 'share' ? 'Consultar la cesión' : 'Ver conversación', 'forum-thread', { id: thread.id, kind: 'secondary', small: true })}</div>
    </article>`).join('');
  }
  function renderForum() {
    return back('report', 'Volver a los reportes') + heading('Foro de movilidad.', 'Información por zonas y conversaciones de esta visita.', '', 'PartekaTU · Compartir')
      + `<div class="forum-notice">${banner('Foro local de ejemplo.', 'Los mensajes no se publican en Internet, no crean reservas ni dan puntos. No escribas direcciones exactas, contactos, matrículas ni datos personales.', 'shield', 'neutral')}</div>
      <div class="split forum-layout"><div class="stack">
        <label class="field">Filtrar publicaciones<select id="forum-category"><option value="all"${state.forumCategory === 'all' ? ' selected' : ''}>Todos los temas</option>${Object.entries(M.FORUM_CATEGORIES).map(([key, label]) => `<option value="${key}"${state.forumCategory === key ? ' selected' : ''}>${label}</option>`).join('')}</select></label>
        <div id="forum-list" class="stack">${forumList()}</div></div>
        <section class="panel panel-pad"><h2>Crear un tema</h2><form id="forum-form" class="form-stack">
        ${selectField('category', 'Tipo de publicación', Object.entries(M.FORUM_CATEGORIES), 'question')}
        ${selectField('zone', 'Zona', M.FORUM_ZONES.map(zone => [zone, zone]), 'Indautxu')}
        <label class="field">Título<input name="title" minlength="5" maxlength="80" required placeholder="Por ejemplo, acceso al parking"></label>
        <label class="field" id="forum-availability-field" hidden>Fecha y horario de la cesión<input name="availability" minlength="5" maxlength="100" placeholder="Por ejemplo, hoy de 18:00 a 21:00"><small>No se cede ni reserva una plaza real desde esta web.</small></label>
        <label class="field">Mensaje<textarea name="message" minlength="10" maxlength="600" required placeholder="Describe la duda, la incidencia o la cesión sin datos personales."></textarea></label>
        ${toggle('stopped', 'Estoy parado.', 'No publiques mientras conduces.', false)}
        <p data-form-error class="inline-message" role="alert" hidden></p><button class="button contrast full" type="submit">${icon('chat')} Publicar en esta visita</button></form></section></div>`;
  }
  function renderThread() {
    const thread = state.forumThreads.find(item => item.id === state.selectedThreadId);
    if (!thread) return renderForum();
    return back('forum', 'Volver al foro') + heading(thread.title, `${M.FORUM_CATEGORIES[thread.category]} · ${thread.zone}`, thread.own && !thread.closed ? button('Cerrar publicación', 'close-thread', { id: thread.id, kind: 'secondary' }) : '', 'PartekaTU · Conversación')
      + `<div class="wide-narrow stack"><article class="panel panel-pad forum-message"><div class="row"><span class="chip">${thread.own ? 'Tu publicación local' : 'Ejemplo de la comunidad'}</span>${thread.closed ? '<span class="chip gray">Cerrado</span>' : ''}</div><p>${e(thread.message)}</p>${thread.availability ? `<p class="forum-availability">${icon('clock')} ${e(thread.availability)}</p>` : ''}<p class="footnote">No constituye una reserva, un pago ni una cesión real de una plaza.</p></article>
        <section class="panel panel-pad"><h2>Respuestas (${thread.replies.length})</h2><div class="forum-replies">${thread.replies.length ? thread.replies.map(reply => `<article class="forum-reply"><strong>${reply.own ? 'Tu respuesta local' : 'Respuesta de ejemplo'}</strong><span>${time(reply.createdAt)}</span><p>${e(reply.text)}</p></article>`).join('') : '<p class="small muted">Todavía no hay respuestas.</p>'}</div>
        ${thread.closed ? banner('La publicación está cerrada.', 'Ya no admite nuevas respuestas.', 'info', 'neutral') : `<form id="forum-reply-form" class="form-stack"><label class="field">${thread.category === 'share' ? 'Consultar la cesión o responder' : 'Tu respuesta'}<textarea name="message" minlength="3" maxlength="600" required placeholder="Escribe sin datos personales."></textarea></label>${toggle('stopped', 'Estoy parado.', 'La respuesta solo se conserva durante esta visita.', false)}<p data-form-error class="inline-message" role="alert" hidden></p><button class="button contrast" type="submit">Añadir respuesta local</button></form>`}</section></div>`;
  }
  function currentReport() { return state.reports.find(r => r.id === state.lastReportId); }
  function renderPending() {
    const report = currentReport();
    if (!report) return renderReport();
    if (report.validated) return renderValidated();
    return `<div class="narrow">${back('report', 'Volver a comunidad')}<section class="panel panel-pad"><div class="eyebrow">EN VALIDACIÓN</div><h1 style="margin-top:13px">Recibido. Ahora lo contrastamos.</h1><p class="muted">Tu reporte no cambia aún la disponibilidad y todavía no ha sumado puntos.</p>${sensorInfo(M.PARKINGS.find(p => p.id === report.parkingId), false)}<div class="itinerary">${[['check', 'Reporte recibido', `${observationNames[report.observation]} · ${time(report.submittedAt)}`, 'Hecho'], ['clock', 'Contraste de fuentes', `Sensor ${report.sensorId} y aportaciones del mismo ámbito.`, 'Pendiente'], ['leaf', 'Reconocimiento', 'Los puntos se conceden después de validar.', 'Pendiente']].map(([glyph, title, detail, status]) => `<div class="route-step"><span class="step-icon">${icon(glyph)}</span><div><h3>${e(title)}</h3><p>${e(detail)}</p></div><span class="step-time">${status}</span></div>`).join('')}</div><div class="form-actions">${goButton('Volver al mapa', 'map', { kind: 'secondary' })}${button('Completar validación de ejemplo', 'validate-report', { kind: 'green', glyph: 'check' })}</div><p class="footnote" style="margin-top:15px">El botón representa la validación automática que haría un servicio real. Aquí no se consultan sensores físicos.</p></section></div>`;
  }
  function renderValidated() {
    if (!currentReport()?.validated) return renderPending();
    return `<div class="narrow"><section class="panel empty-state"><div class="success-symbol">${icon('check')}</div><div class="eyebrow green">VALIDACIÓN COMPLETADA</div><h1 style="margin-top:12px">Gracias por aportar confianza.</h1><p>Tu verificación de ejemplo ha sumado 10 puntos. Las cifras de disponibilidad no se alteran con un reporte local.</p><div class="metrics two" style="max-width:480px;margin:25px auto;text-align:left">${metric('+10', 'Puntos por verificar', 'Aportación validada')}${metric(state.points, 'Tu saldo de ejemplo', 'Sin valor monetario')}</div><div class="row">${goButton('Ver mi movilidad', 'rewards', { kind: 'green', glyph: 'leaf' })}${goButton('Volver al mapa', 'map', { kind: 'secondary' })}</div></section></div>`;
  }
  function renderRewards() {
    const transactions = [
      ...state.reports.filter(r => r.validated).map(r => ({ glyph: 'check', label: 'Verificación ciudadana', detail: `Reporte ${r.id} · validado en esta visita`, amount: '+10' })),
      ...state.ticketClaims.filter(t => t.status === 'validated').map(t => ({ glyph: 'train', label: 'P+R + transporte público acreditado', detail: `Ticket ${t.reference} · validación de ejemplo`, amount: '+' + M.TICKET_REWARD })),
      ...Array.from({ length: state.redemptions }, () => ({ glyph: 'gift', label: 'Canje Barik de ejemplo', detail: 'Sin recarga ni transacción real', amount: '−100' }))
    ];
    return heading('Mis puntos y recompensas.', 'Saldo de esta visita, justificantes validados y canjes de ejemplo.', '', 'SariTU · Premiar')
      + `<div class="split"><div class="stack"><section class="balance-card">${icon('leaf')}<div class="eyebrow">PUNTOS DE MOVILIDAD SOSTENIBLE</div><div class="balance">${state.points}</div><p>Tu saldo de ejemplo. Cada decisión puede contar.</p><span class="chip" style="background:#ffffff12;color:#e1eddd;border-color:#ffffff25">Solo en esta visita · sin valor real</span></section>
        <div class="metrics two">${metric(state.ticketClaims.filter(t => t.status === 'validated').length, 'Usos intermodales acreditados', 'Barik + ticket P+R validados')}${metric(state.reports.filter(r => r.validated).length, 'Aportaciones validadas', 'Sensor identificado')}</div>
        <section class="panel panel-pad"><h3>Tu actividad</h3>${transactions.length ? transactions.map(t => `<div class="transaction">${icon(t.glyph)}<div><strong>${e(t.label)}</strong><small>${e(t.detail)}</small></div><span class="amount${t.amount.startsWith('−') ? ' negative' : ''}">${t.amount}</span></div>`).join('') : '<p class="footnote">Acredita un uso intermodal o verifica la lectura de un sensor para sumar puntos.</p>'}<div class="transaction">${icon('leaf')}<div><strong>Saldo inicial de ejemplo</strong><small>Punto de partida de esta versión local</small></div><span class="amount">+110</span></div></section>
        ${state.ticketClaims.length ? `<section class="panel panel-pad ticket-list"><h3>Justificantes de esta visita</h3>${state.ticketClaims.map(t => `<div class="transaction">${icon(t.status === 'validated' ? 'check' : 'clock')}<div><strong>${e(t.reference)}</strong><small>${{ pending: 'Pendiente de validar', validated: 'Validado · +30 puntos', cancelled: 'Cancelado al desvincular Barik' }[t.status]}</small></div>${button('Ver estado', 'ticket-details', { id: t.id, kind: 'quiet', small: true })}</div>`).join('')}</section>` : ''}</div>
        <div class="stack"><section class="panel panel-pad"><div class="eyebrow">BARIK PERSONALIZADA</div><h3 style="margin:12px 0 20px">Tu movilidad vuelve a ti.</h3><div class="reward-visual"><div class="barik-card"><strong>barik</strong><span>${state.barik ? `PERSONALIZADA · •••• ${e(state.barik.lastFour)}` : 'VINCULACIÓN LOCAL · SIN VALOR REAL'}</span></div></div>
        <h3 style="margin-top:22px">${state.barik ? e(state.barik.alias) : 'Vincula tu tarjeta personalizada'}</h3><p class="small muted">1. Vincula tu Barik. 2. Sube la foto del ticket P+R. 3. Valida el uso intermodal para sumar 30 puntos de ejemplo.</p>
        ${goButton(state.barik ? 'Subir ticket del P+R' : 'Vincular mi Barik', state.barik ? 'ticket' : 'barik', { kind: 'green', full: true, glyph: state.barik ? 'upload' : 'card' })}
        ${state.barik ? `<div style="margin-top:10px">${goButton('Gestionar tarjeta vinculada', 'barik', { kind: 'secondary', full: true })}</div>` : ''}<p class="footnote" style="margin-top:13px">Vinculación y validación de ejemplo. No se comprueba la tarjeta con el operador ni se envían fotografías.</p></section>
        <section class="card"><div class="eyebrow">CANJE EN TRANSPORTE PÚBLICO</div><h3>100 puntos, una recompensa.</h3><p>No hay recargas reales ni acuerdos comerciales activos.</p><div style="margin-top:16px">${button(!state.barik ? 'Vincula Barik para canjear' : state.points >= 100 ? 'Canjear 100 puntos · ejemplo' : 'Necesitas 100 puntos', state.barik ? 'redeem' : 'go', { view: state.barik ? '' : 'barik', kind: 'secondary', full: true, disabled: !!state.barik && state.points < 100, glyph: 'gift' })}</div></section>
        ${option('Sumar con la comunidad', 'Verifica un sensor cuando estés parado.', 'users', 'go', 'report')}</div></div>`;
  }
  function barikStatus() {
    return `<div class="barik-status">${icon('card')}<div><strong>${e(state.barik.alias)}</strong><small>Barik personalizada · •••• ${e(state.barik.lastFour)}</small></div><span class="chip active">Vinculada localmente</span></div>`;
  }
  function renderBarik() {
    const privacy = banner('No introduzcas el número completo ni tu nombre.', 'Basta un alias y cuatro dígitos de ejemplo. Se mantienen solo durante esta visita; no verificamos la identidad del titular ni contactamos con Barik.', 'shield', 'neutral');
    return back('rewards', 'Volver a mi movilidad') + heading('Tu Barik, el siguiente paso.', 'Vincula una tarjeta personalizada antes de acreditar el uso de un parking disuasorio.')
      + `<div class="split"><section class="panel panel-pad">${state.barik
        ? `<h2>Tu tarjeta de esta visita</h2>${barikStatus()}<p class="small muted" style="margin-top:18px">La vinculación es local y de ejemplo. Tu tarjeta real no se ha modificado.</p><div class="stack">${goButton('Continuar: subir ticket del P+R', 'ticket', { kind: 'green', full: true, glyph: 'upload' })}${button('Desvincular tarjeta y eliminar foto', 'unlink-barik', { kind: 'secondary', full: true })}</div>`
        : `<form id="barik-form" class="form-stack"><h2>Vincular Barik personalizada</h2><label class="field">Alias para reconocerla<input name="alias" value="Mi Barik" maxlength="40" required autocomplete="off"><small>No uses tu nombre real.</small></label><label class="field">Cuatro últimos dígitos · ejemplo<input name="lastFour" inputmode="numeric" pattern="[0-9]{4}" minlength="4" maxlength="4" placeholder="1234" required autocomplete="off"><small>No pedimos el número completo ni documentación personal.</small></label>${toggle('personalized', 'Mi tarjeta Barik es personalizada.', 'No se admiten tarjetas anónimas para este flujo.', false)}${toggle('consent', 'Acepto la vinculación local de ejemplo.', 'No crea ninguna asociación real con el operador.', false)}<p id="barik-error" class="inline-message" role="alert" hidden></p><button class="button green" type="submit">${icon('card')} Vincular y continuar</button></form>`}</section>
        <div class="stack">${privacy}${card('positive', 'RECOMPENSAS CON JUSTIFICANTE', 'Barik + P+R + transporte público.', 'Sube la fotografía del ticket del parking disuasorio y confirma el uso intermodal. Los puntos se suman solo después de la validación.', '30 puntos de ejemplo por ticket válido, sin duplicados')}${card('', 'SIN TARJETAS GUARDADAS', 'Al cerrar, esta vinculación desaparece.', 'Las preferencias de la interfaz sí pueden persistir. El alias, los cuatro dígitos y los justificantes no se guardan en el navegador.')}</div></div>`;
  }
  function photoMarkup(photo) {
    return `<figure class="ticket-preview"><img src="${e(photo.url)}" alt="Vista previa local del ticket de parking seleccionado"><figcaption>${e(photo.name)} · ${(photo.size / 1024).toFixed(0)} KB · no se envía a servidores</figcaption></figure>`;
  }
  function renderTicket() {
    const headingHtml = back('rewards', 'Volver a mi movilidad') + heading('Tu ticket acredita el cambio.', 'Parking disuasorio + transporte público. Una foto y una tarjeta personalizada, sin formularios largos.');
    if (!state.barik) return headingHtml + `<div class="narrow">${card('', 'PRIMERO, TU TARJETA', 'Vincula una Barik personalizada.', 'Necesitas una tarjeta vinculada antes de presentar un justificante.', '', goButton('Vincular tarjeta de ejemplo', 'barik', { kind: 'green', full: true, glyph: 'card' }))}</div>`;
    const photo = ticketPhoto && !ticketPhoto.claimId ? ticketPhoto : null;
    return headingHtml + `<div class="split"><form id="ticket-form" class="panel panel-pad form-stack">
      <div class="proof-steps"><span>1. Barik vinculada</span><span class="active">2. Foto del ticket</span><span>3. Validación</span></div>${barikStatus()}
      ${selectField('parking', 'Parking disuasorio del ticket', M.PARKINGS.filter(p => p.type === 'pr').map(p => [p.id, p.name]), 'leioa')}
      <label class="field">Referencia del ticket<input name="reference" maxlength="40" minlength="3" placeholder="Por ejemplo, PR-2026-001" required autocomplete="off"><small>De 3 a 40 letras, números, espacios, / o guiones. Sin matrículas ni datos personales.</small></label>
      <div class="upload-box">${icon('upload')}<label class="field" for="ticket-file">Fotografía del ticket de parking</label><p>Utiliza un justificante de ejemplo sin datos personales. JPEG, PNG o WebP · hasta 5 MB.</p><input id="ticket-file" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="ticket-photo-status"><div id="ticket-photo-preview">${photo ? photoMarkup(photo) + button('Quitar fotografía', 'remove-ticket-photo', { kind: 'quiet', small: true }) : ''}</div><p id="ticket-photo-status" class="footnote" role="status">${photoLoading ? 'Comprobando la imagen…' : photo ? 'Fotografía preparada para el envío local.' : 'Todavía no has seleccionado una fotografía.'}</p></div>
      ${toggle('intermodal', 'He combinado este P+R con transporte público.', 'El ticket debe corresponder al uso intermodal que acreditas.', false)}
      ${toggle('stopped', 'Estoy parado y puedo completar el envío.', 'Nunca subas documentos ni rellenes formularios en marcha.', false)}
      <p id="ticket-error" class="inline-message" role="alert"${photoError ? '' : ' hidden'}>${e(photoError)}</p>
      <button id="ticket-submit" class="button green" type="submit"${!photo || photoLoading ? ' disabled' : ''}>${icon('upload')} Enviar a validación · ejemplo</button>
      <p class="footnote">Seleccionar o enviar una foto no concede puntos. El archivo solo se abre localmente; no existe OCR ni validación real con el operador.</p></form>
      <div class="stack">${card('positive', 'SOLO DESPUÉS DE VALIDAR', '+30 puntos de movilidad.', 'El ticket y la tarjeta deben estar presentes. Un mismo justificante o una misma fotografía no se premian dos veces.', 'Recompensa conceptual, sin valor monetario')}
      ${banner('La foto no sale de tu dispositivo.', 'Se descarta al validar, quitarla o desvincular la tarjeta. Tampoco se guarda al recargar o cerrar esta página.', 'shield', 'neutral')}
      ${option('Cambiar o desvincular mi Barik', 'Gestionar la tarjeta de esta visita.', 'card', 'go', 'barik')}
      ${option('Consultar mis puntos', 'Actividad y justificantes pendientes.', 'leaf', 'go', 'rewards')}</div></div>`;
  }
  function renderTicketStatus() {
    const ticket = state.ticketClaims.find(t => t.id === state.lastTicketId);
    if (!ticket) return renderTicket();
    const parking = M.PARKINGS.find(p => p.id === ticket.parkingId);
    const valid = ticket.status === 'validated';
    const cancelled = ticket.status === 'cancelled';
    const photo = ticketPhoto?.claimId === ticket.id ? ticketPhoto : null;
    return back('rewards', 'Ver todos los justificantes') + heading(valid ? 'Tu cambio de transporte ya cuenta.' : cancelled ? 'Este justificante se ha cancelado.' : 'Ticket recibido. Puntos aún pendientes.', valid ? 'Validación local de ejemplo completada.' : cancelled ? 'Se desvinculó la tarjeta asociada. No se han concedido puntos.' : 'La fotografía está preparada. Todavía no se ha acreditado un uso real.')
      + `<div class="split"><section class="panel panel-pad"><div class="proof-steps"><span>1. Barik personalizada</span><span>2. Foto comprobada</span><span class="active">3. ${valid ? 'Validado' : cancelled ? 'Cancelado' : 'Pendiente'}</span></div>
      <h2>Ticket ${e(ticket.reference)}</h2><p class="small muted">${e(parking.name)} · enviado a las ${time(ticket.submittedAt)}</p>
      ${photo ? photoMarkup(photo) : '<p class="footnote">La imagen ya no se conserva en esta vista. Solo queda la referencia local de este justificante.</p>'}
      ${valid ? `<div class="metrics two" style="margin-top:22px">${metric('+30', 'Puntos concedidos', 'Una sola vez por justificante')}${metric(state.points, 'Saldo de ejemplo', 'Sin recarga ni dinero real')}</div>` : cancelled ? banner('Puedes empezar un envío nuevo.', 'Vincula una tarjeta y vuelve a adjuntar el justificante.', 'info', 'neutral') : `<div style="margin-top:20px">${banner('Sin validación, no hay puntos.', 'En un servicio real se contrastarían la tarjeta personalizada, el ticket y el uso de transporte público. Aquí ese proceso se representa con un botón explícito.', 'clock', 'neutral')}</div>`}
      <div class="form-actions">${goButton('Mi movilidad', 'rewards', { kind: 'secondary' })}${!valid && !cancelled ? button('Completar validación de ejemplo', 'validate-ticket', { kind: 'green', glyph: 'check' }) : cancelled ? goButton('Vincular Barik', 'barik', { kind: 'green' }) : goButton('Presentar otro ticket', 'ticket', { kind: 'green' })}</div></section>
      <div class="stack">${card(valid ? 'positive' : 'unknown', 'BARIK Y TRANSPORTE PÚBLICO', 'Un justificante, una recompensa.', 'Ni finalizar la ruta ni enviar varias veces una imagen vuelve a sumar puntos. Los canjes también requieren mantener una tarjeta vinculada.')}${card('', 'TRANSPARENCIA', 'Esto no acredita un viaje real.', 'No consultamos Barik, sensores ni operadores. La fotografía se valida como archivo de imagen, no como comprobante auténtico.')}</div></div>`;
  }
  function clearTicketPhoto() {
    photoGeneration += 1;
    if (ticketPhoto) URL.revokeObjectURL(ticketPhoto.url);
    ticketPhoto = null;
    photoLoading = false;
    photoError = '';
  }
  function updatePhotoPreview() {
    const preview = document.getElementById('ticket-photo-preview');
    if (!preview) return;
    const photo = ticketPhoto && !ticketPhoto.claimId ? ticketPhoto : null;
    preview.innerHTML = photo ? photoMarkup(photo) + button('Quitar fotografía', 'remove-ticket-photo', { kind: 'quiet', small: true }) : '';
    document.getElementById('ticket-photo-status').textContent = photoLoading ? 'Comprobando la imagen…' : photo ? 'Fotografía preparada para el envío local.' : 'Todavía no has seleccionado una fotografía.';
    document.getElementById('ticket-submit').disabled = !photo || photoLoading;
    const error = document.getElementById('ticket-error');
    error.textContent = photoError;
    error.hidden = !photoError;
  }
  async function chooseTicketPhoto(file) {
    clearTicketPhoto();
    if (!file) { updatePhotoPreview(); return; }
    if (!M.TICKET_IMAGE_TYPES.includes(file.type) || file.size === 0 || file.size > M.MAX_TICKET_BYTES) {
      photoError = 'Selecciona una imagen JPEG, PNG o WebP no vacía de hasta 5 MB.';
      notify(photoError, true);
      updatePhotoPreview();
      return;
    }
    const generation = photoGeneration;
    const url = URL.createObjectURL(file);
    photoLoading = true;
    updatePhotoPreview();
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('La imagen no tiene dimensiones válidas.');
      if (!window.crypto?.subtle) throw new Error('El navegador no permite comprobar la huella local de la imagen.');
      const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
      if (generation !== photoGeneration) { URL.revokeObjectURL(url); return; }
      ticketPhoto = { url, name: file.name, type: file.type, size: file.size, fingerprint: Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join(''), claimId: null };
    } catch (error) {
      URL.revokeObjectURL(url);
      if (generation !== photoGeneration) return;
      console.warn('AparkaTu: no se pudo abrir el justificante.', error);
      photoError = 'No se pudo leer esta imagen. Prueba una fotografía válida en un navegador actualizado.';
      notify(photoError, true);
    } finally {
      if (generation === photoGeneration) {
        photoLoading = false;
        updatePhotoPreview();
      }
    }
  }
  function renderRedeemed() {
    if (!state.redemptions) return renderRewards();
    return `<div class="narrow"><section class="panel empty-state"><div class="success-symbol">${icon('gift')}</div><div class="eyebrow green">CANJE DE EJEMPLO COMPLETADO</div><h1 style="margin-top:13px">Tu movilidad sigue sumando.</h1><p>Se han descontado 100 puntos del saldo de esta visita. No se ha realizado una recarga Barik ni ninguna operación real.</p><div class="metrics two" style="max-width:460px;margin:25px auto;text-align:left">${metric('100', 'Puntos utilizados', 'Solo en este ejemplo')}${metric(state.points, 'Saldo restante', 'No se guarda al cerrar')}</div>${goButton('Volver a mi movilidad', 'rewards', { kind: 'green', glyph: 'arrow' })}</section></div>`;
  }
  function renderSettings() {
    const p = state.preferences;
    return heading('Que la web se adapte a ti.', 'Modo nocturno, colores, lectura y avisos. Elige cómo te resulta más cómoda.')
      + `<form id="settings-form"><div class="two-col"><section class="panel panel-pad"><div class="theme-setting"><h2>De día y de noche</h2>${selectField('theme', 'Apariencia de la web', [['light', 'Modo diurno'], ['dark', 'Modo nocturno']], p.theme)}<p class="footnote" style="margin-top:12px">También puedes cambiarla con el botón de luna o sol de la cabecera. Tu elección se recuerda en este navegador.</p></div>
        <h2>Ver con claridad</h2><p class="small muted">El mapa combina etiquetas, formas y colores en ambos temas.</p><fieldset><legend>COLORES DEL MAPA</legend><div class="radio-options">${Object.entries(visionNames).map(([key, title]) => `<label class="radio-option"><input type="radio" name="vision" value="${key}"${p.vision === key ? ' checked' : ''}><span><strong>${title}</strong><small>${{ standard: 'Rojo y verde, con señales redundantes.', deuteranopia: 'Azul y naranja, con etiquetas A y B.', protanopia: 'Azul y ocre, con triángulo y círculo.', tritanopia: 'Verde azulado y magenta, con etiquetas.' }[key]}</small></span></label>`).join('')}</div></fieldset><section class="panel map-panel" style="margin-top:20px">${mapMarkup(false, true)}${mapLegend()}</section></section>
        <div class="stack"><section class="panel panel-pad"><h2>Leer con calma</h2><div class="form-stack">${selectField('font', 'Tipografía', [['inter', 'Inter · estándar'], ['lexend', 'Lexend · lectura adaptada']], p.font)}${selectField('spacing', 'Espacio entre líneas', [['normal', 'Normal'], ['wide', 'Amplio']], p.spacing)}</div>${toggle('simple', 'Lectura simplificada', 'Oculta información secundaria, sin quitar advertencias de seguridad.', p.simple)}${goButton('Ver lectura guiada', 'reading', { kind: 'secondary', full: true, glyph: 'access' })}</section>
        <section class="panel panel-pad"><h2>Avisos y preferencias</h2>${toggle('alerts', 'Avisos preventivos', 'Consulta alertas de eventos y clima antes de viajar.', p.alerts)}${option('Mis condiciones de acceso', 'PMR, permiso de residente y distancia a pie.', 'sliders', 'go', 'profile')}${option('Estado de la información', 'Lecturas, sensores y datos caducados.', 'clock', 'go', 'connection')}</section>
        ${banner('Preferencias locales. Tú decides.', 'Solo estas opciones se guardan en tu navegador. Puedes restablecerlas cuando quieras.', 'shield', 'neutral')}${button('Abrir asistente de ayuda', 'toggle-assistant', { kind: 'secondary', full: true, glyph: 'chat' })}</div></div>
        <div class="form-actions">${button('Restablecer preferencias', 'reset-preferences', { kind: 'secondary' })}<button class="button" type="submit">${icon('check')} Guardar preferencias</button></div></form>`;
  }
  function renderReading() {
    return back('settings', 'Volver a accesibilidad') + heading('Llegar, paso a paso.', 'Una explicación sencilla del recorrido de referencia.')
      + `<div class="split"><section class="reading-preview" style="font-family:Lexend,sans-serif"><h3>Una buena alternativa.</h3><p>Vas a San Mamés.</p><ol><li>Ve a P+R Leioa.</li><li>Continúa en Metro L1.</li><li>Camina unos 4 minutos.</li></ol><p>El trayecto dura unos 31 minutos.</p><p><strong>La plaza no está reservada.</strong><br>Comprueba que puedes aparcar al llegar.</p></section><div class="stack">${button('Escuchar la explicación', 'read-aloud', { kind: 'secondary', full: true, glyph: 'sound' })}${button('Usar esta lectura en toda la web', 'enable-reading', { kind: 'green', full: true, glyph: 'check' })}${button('Ver la ruta', 'select-route', { id: 'metro', kind: 'secondary', full: true, glyph: 'arrow' })}${banner('Lectura clara, información completa.', 'Los avisos importantes nunca se ocultan. El dato caducado siempre figura como desconocido.', 'info', 'neutral')}</div></div>`;
  }
  function renderPrivacy() {
    return heading('Tus datos, bajo tu control.', 'La confianza empieza por explicar qué sabemos, qué no y qué guardamos.')
      + `<div class="split"><section class="panel panel-pad"><h2>Privacidad desde el principio</h2>${[
        ['shield', 'Sin historial de trayectos.', 'Origen y destino se mantienen solo en memoria mientras está abierta la página. No se envían ni se guardan en el navegador.'],
        ['users', 'Reportes separados de Barik.', 'Las observaciones se asocian al sensor físico identificado, no a tu tarjeta ni a tu identidad. No incluyen nombres, matrículas ni imágenes.'],
        ['chat', 'PartekaTU solo durante esta visita.', 'Las publicaciones, ofertas y respuestas del foro se mantienen en memoria y se pierden al recargar o cerrar. No se publican en Internet, no reservan plazas y no deben incluir datos personales.'],
        ['card', 'Barik personalizada, sin datos completos.', 'Solo pedimos un alias y cuatro dígitos de ejemplo. No se comprueba una identidad real. La vinculación se pierde al recargar o cerrar la página.'],
        ['upload', 'Tu foto se queda en el dispositivo.', 'El ticket se abre localmente y se calcula una huella para evitar duplicados. No hay subida a servidores ni OCR. La imagen se descarta al validar, quitarla, reemplazarla, desvincular Barik o cerrar la página. Las referencias quedan solo durante esta visita.'],
        ['chat', 'Asistente local.', 'Usa respuestas guiadas y los datos de ejemplo. La conversación no se envía a una IA ni se guarda en el navegador. No escribas información personal.'],
        ['pin', 'Ubicación opcional.', 'La web no solicita GPS. Puedes introducir origen y destino manualmente.'],
        ['sliders', 'Preferencias guardadas en este navegador.', 'Se conservan el tema nocturno, la accesibilidad y las condiciones de acceso. No usamos analítica.'],
        ['map', 'Cartografía de OpenFreeMap.', 'El mapa necesita Internet. OpenFreeMap y su red de distribución reciben tu dirección IP y las solicitudes de la zona que visualizas. No enviamos búsquedas, reportes, tarjetas, fotos ni conversaciones. No se solicita el GPS. La ocupación, los sensores y las capas de BateraTU son ejemplos locales.'],
        ['chart', 'Equivalencia de AurrezTU.', 'El ahorro del perfil usa un factor ilustrativo de 30 puntos intermodales por 1,2 kg de CO₂. No es una medición ni una equivalencia oficial de Barik. Solo cuentan los justificantes validados, no los reportes, los puntos iniciales ni las publicaciones.']
      ].map(([glyph, title, text]) => `<article class="privacy-point">${icon(glyph)}<div><h3>${title}</h3><p>${text}</p></div></article>`).join('')}${button('Borrar mis preferencias guardadas', 'clear-preferences', { kind: 'secondary', full: true })}</section>
      <div class="stack">${card('unknown', 'NO CONFUNDIMOS AUSENCIA CON DISPONIBILIDAD', 'Caducado significa desconocido.', 'Cada lectura muestra sensor, ubicación, hora y antigüedad. Las lecturas del ejemplo son válidas durante 3 minutos.', 'Umbral ilustrativo, no una regla oficial del operador', goButton('Ver el estado de los datos', 'connection', { kind: 'secondary', full: true }))}
      ${card('positive', 'INFORMAR, NO RESERVAR', 'Sin promesas de una plaza.', 'La ocupación puede cambiar antes de que llegues. Los rangos y tiempos son estimaciones. La señalización y el operador determinan las condiciones reales.')}
      ${card('', 'SENSORES DE CADA INFRAESTRUCTURA', 'Un origen identificable para cada lectura.', 'OTA y parkings muestran identificadores, dispositivos y ubicaciones concretas del escenario. Todos ellos son ficticios, no instalaciones verificadas.')}
      ${state.barik ? button('Desvincular Barik y eliminar la foto', 'unlink-barik', { kind: 'secondary', full: true }) : ''}
      <section class="card"><div class="eyebrow">PROVEEDOR DEL MAPA</div><h3>OpenFreeMap y OpenStreetMap</h3><p>Las calles proceden de cartografía real. Las áreas de presión y los puntos del catálogo no son lecturas en vivo.</p><p><a href="https://openfreemap.org/privacy/" target="_blank" rel="noreferrer">Privacidad de OpenFreeMap</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Atribución de los datos</a></p></section>
      ${goButton('Ver el impacto agregado', 'impact', { kind: 'secondary', full: true, glyph: 'chart' })}</div></div>`;
  }
  function renderConnection() {
    const outdated = M.PARKINGS.filter(p => M.reading(p, state).available === null).length;
    return heading('La información también necesita contexto.', 'Una lectura antigua no puede contarte lo que está pasando ahora.')
      + `<div class="split"><div class="stack">${banner(state.dataMode === 'offline' ? 'No hay conexión a las fuentes.' : `${outdated} de ${M.PARKINGS.length} fuentes de aparcamiento sin dato válido.`, 'Todas las cifras pertenecen al escenario local de esta web, no a un servicio en vivo.', state.dataMode === 'offline' ? 'offline' : 'clock', 'unknown')}<div class="parking-list">${M.PARKINGS.map(p => parkingRow(p)).join('')}</div></div><section class="panel panel-pad"><h2>Estado de conexión</h2><p class="small muted">Elige cómo se representa la información en esta versión local.</p><label class="field">Disponibilidad de las fuentes<select id="connection-select"><option value="fresh"${state.dataMode === 'fresh' ? ' selected' : ''}>Lecturas de ejemplo disponibles</option><option value="stale"${state.dataMode === 'stale' ? ' selected' : ''}>Datos caducados</option><option value="offline"${state.dataMode === 'offline' ? ' selected' : ''}>Sin conexión</option></select></label><div style="margin-top:18px">${button('Actualizar lecturas de ejemplo', 'refresh', { kind: 'green', full: true, glyph: 'refresh' })}</div><p class="footnote" style="margin-top:18px">La antigüedad avanza mientras utilizas la página. Al superar 3 minutos, la cifra deja de mostrarse como disponible. Actualizar reinicia las lecturas de ejemplo; Abando permanece caducado.</p>${goButton('Consultar un panel público', 'public', { kind: 'secondary', full: true, glyph: 'screen' })}</section></div>`;
  }
  function renderLocation() {
    return heading('Tu ubicación es una elección.', 'Puedes usar AparkaTu sin compartir tu posición.')
      + `<div class="split"><form id="location-form" class="panel panel-pad form-stack"><h2>¿Desde dónde sales?</h2><label class="field">Origen<input name="origin" value="${e(state.origin)}" maxlength="100" required autocomplete="off" placeholder="Por ejemplo, Getxo"></label><label class="field">Destino<input name="destination" value="${e(state.destination)}" maxlength="100" required autocomplete="off" placeholder="Por ejemplo, San Mamés"></label><button class="button" type="submit">${icon('search')} Buscar sin compartir ubicación</button><p class="footnote">Estos lugares solo se mantienen durante esta visita. No se guardan como un historial.</p></form><div class="stack">${card('positive', 'NO NECESITAS DAR PERMISO', 'Sigues teniendo alternativas.', 'Consulta el mapa, el catálogo de aparcamientos y los recorridos de referencia introduciendo tus lugares manualmente.')}${card('', 'TRANSPARENCIA', 'Sin acceso al GPS.', 'Los datos de la página son de ejemplo. No calculamos distancias reales a partir de tu dirección ni te seguimos durante el recorrido.')}${goButton('Leer cómo tratamos tus datos', 'privacy', { kind: 'secondary', full: true, glyph: 'shield' })}</div></div>`;
  }
  function renderPublic() {
    const offline = state.dataMode !== 'fresh' || M.PARKINGS.every(p => M.reading(p, state).available === null);
    return heading('La movilidad también se lee aquí.', 'Información en una parada. Sin aplicaciones, registros ni smartphone.', button(offline ? 'Mostrar datos actualizados' : 'Mostrar panel sin actualización', 'toggle-public-data', { kind: 'secondary', glyph: offline ? 'refresh' : 'offline' }))
      + `<section class="public-board"><header class="board-header"><div><div class="board-brand">AparkaTu.</div><p>Movilidad para toda Bizkaia · información pública</p></div><div class="board-clock">LEIOA · <span data-clock>${time(state.now).slice(0, 5)}</span><small>ESCENARIO DE EJEMPLO</small></div></header>${banner(offline ? 'Sin datos actualizados de aparcamiento.' : 'San Mamés: presión alta entre 18:00 y 19:00.', offline ? 'Desconocido no significa libre. Consulta la señalización y al personal de transporte.' : 'Evita buscar plaza en el núcleo. Considera P+R + Metro o una franja alternativa.', offline ? 'offline' : 'bell', offline ? 'unknown' : '')}<div class="board-layout"><div class="stack"><div class="eyebrow">APARCAMIENTOS · INFORMACIÓN ORIENTATIVA</div>${M.PARKINGS.map(p => parkingRow(p, true)).join('')}</div><aside class="board-message">${offline ? `<div class="eyebrow">ORIENTACIÓN SIN CONEXIÓN</div><h3>Puedes seguir orientándote.</h3><p>Consulta la señalización de la parada y al personal de transporte.</p><h3>Metro L1 / L2</h3><p>No mostramos llegadas en tiempo real sin una fuente vigente.</p><span class="connected-pill offline">Reconexión pendiente</span>` : `<div class="eyebrow green">LA OPCIÓN MÁS TRANQUILA</div><h3>P+R + Metro</h3><div class="big-time">31 <small>min</small></div><p>16 minutos menos que ir solo en coche.</p><p>Coche: 47 min, incluida la búsqueda.<br>Bici: 36 min; revisa el aviso de calor.</p><p class="footnote">Ruta sin escalones. Confirma ascensores y condiciones con el operador.</p>`}</aside></div><footer class="board-footer"><strong>Información disponible aquí. No necesitas un móvil para tomar una decisión.</strong><p>Una plaza orientativa no queda reservada. Todos los horarios, tiempos y disponibilidades son de ejemplo.</p></footer></section>`;
  }
  function renderImpact() {
    const impacts = [
      { before: 1000, after: 820, unit: 'min', label: 'Minutos de búsqueda ahorrados', glyph: 'clock' },
      { before: 400, after: 352, unit: 'km', label: 'Kilómetros de vueltas evitados', glyph: 'car' },
      { before: 100, after: 88, unit: 'kg', label: 'CO₂ que dejamos de emitir', glyph: 'leaf' },
      { before: 100, after: 122, unit: 'viajes', label: 'Viajes intermodales adicionales', glyph: 'train' }
    ];
    const impactCards = impacts.map(item => {
      const difference = item.after - item.before;
      const percentage = Math.round(Math.abs(difference) / item.before * 100);
      const format = number => number.toLocaleString('es-ES');
      return metric(`${format(Math.abs(difference))} ${item.unit}`, item.label, `Antes: ${format(item.before)} → ahora: ${format(item.after)} ${item.unit}`, item.glyph, `${difference < 0 ? '−' : '+'}${percentage} %`);
    }).join('');
    const sources = [
      [M.reading(M.PARKINGS[2], state).status !== 'fresh' ? 'unknown' : '', 'OTA', 'Lectura caducada', freshness(M.PARKINGS[2])],
      [M.reading(M.PARKINGS[0], state).status === 'fresh' ? 'positive' : 'unknown', 'Parkings', 'Lectura orientativa', freshness(M.PARKINGS[0])],
      ['', 'Clima', 'Escenario térmico', 'Datos climáticos de ejemplo'],
      ['', 'Agenda', 'Riesgo por eventos', 'Evento de referencia, no vigente'],
      ['positive', 'Comunidad', 'Reportes anónimos', `${state.reports.filter(r => r.validated).length} validados en esta visita`]
    ];
    return heading('Impacto de la movilidad.', 'Tiempo de búsqueda, kilómetros y emisiones evitadas.', `<span class="chip">${icon('clock')} Últimos 30 días · ejemplo</span>`, 'AurrezTU · Ahorrar')
      + `<div class="metrics impact-metrics">${impactCards}</div><p class="footnote" style="margin-top:12px">Ahorro agregado durante 30 días respecto al escenario habitual equivalente. El porcentaje compara el cambio con el valor anterior. Todas las cifras son de ejemplo.</p>
        <div class="two-col" style="margin-top:23px"><section class="panel map-panel"><div class="panel-head"><div><h2>Anticipar antes de saturar.</h2><p>Presión urbana prevista · esquema de referencia</p></div>${icon('map')}</div>${mapMarkup(false, true)}${mapLegend()}</section><section class="panel panel-pad"><h3>Menos minutos dando vueltas.</h3><p class="small muted">50 minutos ahorrados en los últimos 7 días del periodo · ejemplo</p><div class="chart" role="img" aria-label="Minutos evitados de ejemplo: lunes 4, martes 6, miércoles 5, jueves 8, viernes 9, sábado 7 y domingo 11. Total: 50 minutos.">${[4, 6, 5, 8, 9, 7, 11].map((v, i) => `<div class="chart-col"><span class="chart-value">${v}</span><div class="chart-bar" style="height:${v * 11}px"></div><span class="chart-day">${['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}</span></div>`).join('')}</div><div class="metrics two">${metric('26 avisos', 'Falsas alarmas evitadas', 'Antes: 100 → ahora: 74', '', '−26 %')}${metric('184', 'Aportaciones validadas', 'Indicador social de ejemplo')}</div></section></div>
        <div class="section-title"><h2>Cinco fuentes. Ninguna falsa certeza.</h2><span class="small muted">Origen y fiabilidad a la vista</span></div><div class="source-grid">${sources.map(([tone, name, detail, foot]) => `<section class="card source-card ${tone}"><div class="eyebrow">${name}</div><h3>${detail}</h3><div class="meta">${foot}</div></section>`).join('')}</div>
        <div class="section-title"><h2>Funciones de AparkaTu</h2></div><div class="ecosystem-grid">${[['chart', 'APARCAMIENTO', 'Estado de las zonas', 'Consulta los sensores, la antigüedad de las lecturas y los avisos de saturación.'], ['access', 'ACCESIBILIDAD', 'Opciones compatibles', 'Filtra por plazas PMR, recorridos sin escalones y distancia a pie.'], ['leaf', 'CALOR Y ENTORNO', 'Sombra en el recorrido', 'Consulta los avisos de calor y los espacios verdes de referencia.'], ['train', 'TRANSPORTE', 'Comparación de rutas', 'Compara coche, Metro y bici contando la búsqueda y el tramo a pie.']].map(([glyph, area, title, text]) => `<section class="card"><div class="card-icon"><span class="eyebrow">${area}</span>${icon(glyph)}</div><h3>${title}</h3><p>${text}</p></section>`).join('')}</div><p class="footnote" style="margin-top:22px">Todas las cifras de impacto son ilustrativas. Un servicio real deberá comparar periodos equivalentes y publicar su metodología, cobertura e incertidumbre. No se muestran trayectos individuales.</p>`;
  }
  function renderWelcome() {
    return `<div class="wide-narrow">${heading('Menos vueltas. Más ciudad.', 'Una forma más tranquila de moverte por Bizkaia.', '', 'Bienvenido a AparkaTu')}<div class="two-col"><section class="panel map-panel">${mapMarkup(false)}${mapLegend()}</section><div class="stack">${card('positive', 'APARCA CON INFORMACIÓN CLARA', 'Encuentra una opción compatible.', 'Configura tus necesidades de acceso, consulta la frescura de los datos y compara alternativas.')}${card('', 'NO HACE FALTA UNA CUENTA', 'Empieza sin dejar huella.', 'No guardamos tus trayectos. Solo tus preferencias se mantienen en tu navegador.')}${goButton('Preparar mi perfil', 'profile', { kind: 'green', full: true, glyph: 'arrow' })}${goButton('Ir directamente al mapa', 'map', { kind: 'secondary', full: true })}</div></div></div>`;
  }
  function savePreferences(message = 'Preferencias guardadas en este navegador.') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.preferences));
      notify(message);
    } catch (error) {
      console.warn('AparkaTu: no se pudieron guardar las preferencias.', error);
      notify('Los cambios están activos, pero este navegador no permite guardarlos.', true);
    }
    applyPreferences();
  }
  function applyPreferences() {
    applyTheme(state.preferences.theme);
    document.body.dataset.vision = state.preferences.vision;
    document.body.dataset.font = state.preferences.font;
    document.body.dataset.spacing = state.preferences.spacing;
    document.body.dataset.simple = String(state.preferences.simple);
    AparkaMaps.appearance();
  }
  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    const dark = theme === 'dark';
    const control = document.getElementById('theme-button');
    control.innerHTML = icon(dark ? 'sun' : 'moon');
    control.setAttribute('aria-pressed', String(dark));
    control.setAttribute('aria-label', dark ? 'Activar modo diurno' : 'Activar modo nocturno');
    control.title = dark ? 'Activar modo diurno' : 'Activar modo nocturno';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#111813' : '#172b22';
    AparkaMaps.appearance();
  }
  let toastTimer;
  function notify(message, error = false) {
    const toast = document.getElementById('toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle('error', error);
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, error ? 8000 : 5000);
  }
  function closeMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('menu-backdrop').hidden = true;
    document.getElementById('menu-button').setAttribute('aria-expanded', 'false');
  }
  function activeNav() {
    if (['search', 'results', 'parking', 'sensor', 'location', 'welcome', 'connection', 'profile'].includes(state.view)) return 'map';
    if (['route', 'drive', 'arrival'].includes(state.view)) return 'compare';
    if (['event', 'heat'].includes(state.view)) return 'alerts';
    if (['pending', 'validated', 'forum', 'thread'].includes(state.view)) return 'report';
    if (['redeemed', 'barik', 'ticket', 'ticket-status'].includes(state.view)) return 'rewards';
    if (state.view === 'reading') return 'settings';
    return state.view;
  }
  function renderNavigation() {
    const primary = [['map', 'map', 'Encontrar aparcamiento'], ['compare', 'train', 'Comparar rutas'], ['alerts', 'bell', 'Avisos preventivos'], ['report', 'users', 'Reportes y foro'], ['rewards', 'leaf', 'Puntos y recompensas']];
    const other = [['impact', 'chart', 'Ahorro e impacto'], ['public', 'screen', ''], ['settings', 'access', '']];
    const nav = items => items.map(([view, glyph, description]) => `<a href="#${view}" class="nav-item"${activeNav() === view ? ' aria-current="page"' : ''}>${icon(glyph)}<span class="nav-copy"><strong>${e(views[view][0])}</strong>${description ? `<small>${e(description)}</small>` : ''}</span>${view === 'alerts' && state.preferences.alerts ? '<span class="nav-count">2</span>' : ''}</a>`).join('');
    document.getElementById('main-nav').innerHTML = nav(primary) + '<div class="nav-label">MÁS OPCIONES</div>' + nav(other);
    document.getElementById('breadcrumb-current').textContent = views[state.view][0];
  }
  function updateHeaderPoints() {
    const value = `${state.points} PTS`;
    const counter = document.getElementById('header-points');
    if (counter.textContent !== value) counter.textContent = value;
    document.getElementById('points-button').setAttribute('aria-label', `SariTU: ${state.points} puntos. Ver saldo y recompensas`);
  }
  function render(focus = false) {
    AparkaMaps.destroy();
    applyPreferences();
    renderNavigation();
    updateHeaderPoints();
    main.innerHTML = views[state.view][1]();
    AparkaMaps.mount(main, state, id => {
      state.selectedParking = id;
      navigate('parking');
    });
    document.title = `AparkaTu · ${views[state.view][0]}`;
    if (focus) {
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  function navigate(view, fromHash = false) {
    if (!Object.hasOwn(views, view)) {
      notify('Esa página no existe. Te llevamos al mapa.', true);
      view = 'map';
    }
    if (state.moving && view !== 'drive') {
      notify('Mantén la atención en la vía. Confirma que estás parado para salir del recorrido.', true);
      if (location.hash !== '#drive') history.replaceState(null, '', '#drive');
      return;
    }
    if (view === 'drive' && !state.moving) view = 'route';
    if (state.view !== view) state.history.push(state.view);
    state.view = view;
    closeMenu();
    if (!fromHash && location.hash !== '#' + view) history.pushState(null, '', '#' + view);
    render(true);
  }
  function openModal(title, content) {
    modal.innerHTML = `<div class="modal-header"><h2 id="modal-title">${e(title)}</h2><button class="icon-button" data-action="close-modal" aria-label="Cerrar">${icon('close')}</button></div>${content}`;
    modal.showModal();
  }
  function closeModal() {
    state.redemptionPending = false;
    modal.close();
  }
  function filtersModal() {
    const p = state.preferences;
    openModal('Solo lo que encaja contigo.', `<form id="filters-form">${toggle('pmr', 'Plazas PMR', 'Mantener tus condiciones de accesibilidad.', p.pmr)}${toggle('stepFree', 'Sin escalones', 'Incluir el recorrido desde el aparcamiento.', p.stepFree)}${toggle('preferPr', 'Priorizar P+R', 'Conexión con transporte público.', p.preferPr)}${toggle('includeOTA', 'Incluir zonas OTA', 'Respetar los permisos de residente de tu perfil.', p.includeOTA)}<div style="margin-top:20px">${selectField('maxWalk', 'Distancia máxima a pie', [[50, 'Hasta 50 m'], [100, 'Hasta 100 m'], [300, 'Hasta 300 m'], [600, 'Hasta 600 m']], p.maxWalk)}</div><div class="dialog-actions">${button('Cancelar', 'close-modal', { kind: 'secondary' })}<button class="button" type="submit">Aplicar filtros</button></div></form>`);
  }
  function readSpeech(message) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      notify('Este navegador no ofrece lectura por voz. La explicación sigue disponible en pantalla.', true);
      return;
    }
    speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'es-ES';
    speech.rate = .9;
    speech.onerror = event => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') notify('No se pudo reproducir la voz. Consulta el texto de la pantalla.', true);
    };
    speechSynthesis.speak(speech);
  }
  function appendAssistantMessage(text, user = false, destination = null) {
    const log = document.getElementById('assistant-log');
    const message = document.createElement('div');
    message.className = 'chat-message' + (user ? ' user' : '');
    message.innerHTML = `<span class="sr-only">${user ? 'Tú' : 'Asistente'}: </span><p>${e(text)}</p>${destination ? button(destination.label, destination.action || 'go', { view: destination.view || '', id: destination.id || '', kind: 'quiet', small: true, glyph: 'arrow' }) : ''}`;
    log.append(message);
    while (log.children.length > 40) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function openAssistant() {
    document.getElementById('assistant-panel').hidden = false;
    document.getElementById('assistant-toggle').setAttribute('aria-expanded', 'true');
    if (!document.getElementById('assistant-log').children.length) {
      appendAssistantMessage('Soy GaldeTU. Puedes preguntarme por las zonas de AurkiTU, los avisos de AurreraTU, los puntos de SariTU o cómo utilizar la app. Las respuestas usan datos de ejemplo, no información en vivo.');
    }
    document.getElementById('assistant-input').focus({ preventScroll: true });
  }
  function closeAssistant(restoreFocus = true) {
    document.getElementById('assistant-panel').hidden = true;
    document.getElementById('assistant-toggle').setAttribute('aria-expanded', 'false');
    if (restoreFocus) document.getElementById('assistant-toggle').focus({ preventScroll: true });
  }
  function assistantAnswer(question) {
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const q = normalize(question);
    if (/bateratu|refugio|calidad del aire|itinerario sombreado/.test(q)) {
      return { text: 'En AurkiTU, abre BateraTU junto a los controles del mapa. Puedes activar refugios climáticos, lecturas de PM₂.₅ y recorridos a la sombra.\nSon capas de ejemplo: no confirman la seguridad del aire, la sombra ni la accesibilidad de un itinerario.', action: 'environment-map', label: 'Abrir BateraTU en el mapa' };
    }
    if (/aurreztu|co2|ahorro|emisiones/.test(q)) {
      const impact = M.personalImpact(state);
      return { text: `AurrezTU muestra el impacto agregado y tus hitos en Mi perfil. Durante esta visita tienes ${impact.mobilityPoints} PTS intermodales acreditados: equivalen a ${impact.co2Kg.toLocaleString('es-ES', { maximumFractionDigits: 1 })} kg de CO₂ en este ejemplo.\nEl factor de 30 PTS por 1,2 kg es ilustrativo, no una medición ni una equivalencia oficial de Barik.`, view: 'profile', label: 'Ver mis hitos de AurrezTU' };
    }
    if (/gidatu|bizkaibizi|comparar rutas/.test(q)) {
      const best = M.journeyOptions(state)[0];
      return { text: `GidaTU compara coche, Bizkaibizi y P+R + Metro, incluyendo la búsqueda y el tramo a pie. La opción de menor duración en este escenario es ${modeNames[best.mode]}, con ${best.duration} minutos.\nLas duraciones y la disponibilidad son de ejemplo.`, view: 'compare', label: 'Abrir GidaTU' };
    }
    if (/saritu|barik|ticket|justificante|puntos|canj|recompensa|acreditar/.test(q)) {
      return { text: `${state.barik ? 'Ya tienes una Barik personalizada vinculada localmente.' : 'Primero vincula una Barik personalizada con un alias y cuatro dígitos de ejemplo.'}\nDespués adjunta una foto del ticket de un P+R y confirma que continuaste en transporte público. Solo la validación de ejemplo suma 30 puntos. Finalizar una ruta no los concede.\nNo se recarga tu tarjeta real ni se envía la fotografía.`, view: state.barik ? 'ticket' : 'barik', label: state.barik ? 'Adjuntar ticket del P+R' : 'Vincular mi Barik' };
    }
    if (/aurreratu|evento|partido|concierto|san mames/.test(q) && !/sensor|plaza|zona|estado/.test(q)) {
      return { text: 'En la agenda de ejemplo hay un evento en San Mamés con presión alta prevista de 18:00 a 19:00. Se recomienda decidir antes de entrar: P+R Leioa + Metro o una salida a las 19:15.\nEs un escenario simulado, no un evento verificado de hoy.', view: 'event', label: 'Ver aviso y alternativas' };
    }
    if (/calor|temperatura|clima|sombra|oasis/.test(q)) {
      return { text: 'El escenario de clima muestra 38 °C. Prioriza sombra, paradas cubiertas y transporte público; revisa tu tramo a pie y considera un oasis térmico de referencia como Doña Casilda.\nLa temperatura es de ejemplo. Consulta los avisos oficiales para viajar.', view: 'heat', label: 'Consultar la alternativa más fresca' };
    }
    if (/oscuro|nocturno|noche|tema|luz/.test(q)) {
      return { text: 'Usa el botón de luna o sol de la cabecera. El modo nocturno también está en Accesibilidad → Apariencia. Se recuerda en este navegador y funciona con los tres modos de visión del mapa.', view: 'settings', label: 'Ajustar apariencia y lectura' };
    }
    if (/accesib|pmr|escalon|dislex|leer|lectura|daltoni/.test(q)) {
      return { text: 'En Mi perfil puedes mantener plazas PMR, rutas sin escalones y una distancia máxima a pie. En Accesibilidad puedes elegir deuteranopía, protanopía o tritanopía, tipografía Lexend y más interlineado.\nEl mapa conserva formas y etiquetas: nunca depende solo del color.', view: 'settings', label: 'Abrir accesibilidad' };
    }
    if (/privacidad|datos personales|rastre|historial|guarda/.test(q)) {
      return { text: 'Se guardan las preferencias de interfaz en este navegador. Los reportes no se vinculan a la tarjeta. La Barik, las fotos y esta conversación no se guardan al cerrar o recargar.\nEl mapa descarga cartografía de OpenFreeMap. Ese proveedor recibe tu IP y la zona visible; no le enviamos formularios ni conversaciones. No se solicita el GPS.', view: 'privacy', label: 'Ver privacidad y transparencia' };
    }
    if (/partekatu|foro|vecin|garaje|cesion/.test(q)) {
      return { text: 'PartekaTU reúne los reportes de sensores y el foro vecinal. Puedes escribir dudas, incidencias o una cesión temporal con su zona y horario, y responder a otros temas.\nLas publicaciones son locales: no se comparten por Internet ni reservan plazas. No incluyas datos personales. Los mensajes del foro no conceden puntos.', view: 'forum', label: 'Abrir el foro de PartekaTU' };
    }
    if (/guia|empezar|como uso|paso a paso|ayuda|funciona/.test(q)) {
      return { text: '1. Ajusta tu perfil de acceso.\n2. Busca el destino y revisa el sensor, su ubicación y la antigüedad del dato.\n3. Compara coche, Metro y bici contando también la búsqueda.\n4. Si usas P+R + transporte público, vincula Barik y adjunta tu ticket para acreditar puntos.\nUna plaza indicada nunca queda reservada.', view: 'profile', label: 'Empezar por mi perfil' };
    }
    if (/aurkitu|sensor|zona|estado|plaza|aparcar|disponib|ocup|leioa|indautxu|abando|caduc|conexion/.test(q)) {
      const parking = M.PARKINGS.find(p => q.includes(normalize(p.id)) || q.includes(normalize(p.sensor.id)));
      const targets = parking ? [parking] : M.PARKINGS;
      const readings = targets.map(p => {
        const r = M.reading(p, state);
        return `${p.name}: ${r.available === null ? 'desconocido, no equivale a libre' : `${r.available} plazas orientativas`}.\n${p.sensor.id} · ${p.sensor.location}.\nLectura ${time(r.updatedAt)} · hace ${ageText(r.ageMs)}.`;
      }).join('\n\n');
      return { text: `Consulta a las ${time(state.now)}:\n${readings}\n\nSon sensores y ubicaciones de ejemplo. Las lecturas caducan; consulta el detalle antes de decidir. No se reserva ninguna plaza.`, ...(parking ? { action: 'sensor', id: parking.id, label: 'Ver el sensor y su estado' } : { view: 'connection', label: 'Ver todas las fuentes' }) };
    }
    return { text: 'Puedo ayudarte con el estado de Leioa, Indautxu o Abando; eventos y calor; Barik y tickets; o guiarte por la aplicación. Prueba «estado de Abando» o «cómo vinculo mi Barik».\nNo tengo información fuera de este escenario local.', view: 'map', label: 'Volver a explorar' };
  }
  function askAssistant(question) {
    const text = question.trim();
    if (!text) return notify('Escribe una pregunta para el asistente.', true);
    appendAssistantMessage(text, true);
    const answer = assistantAnswer(text);
    appendAssistantMessage(answer.text, false, answer);
  }
  const actions = {
    go: el => {
      if (el.closest('#assistant-panel')) closeAssistant(false);
      navigate(el.dataset.view);
    },
    'environment-map': () => {
      closeAssistant(false);
      navigate('map');
      const filters = main.querySelector('.environment-filters');
      if (filters) {
        filters.open = true;
        filters.scrollIntoView({ block: 'center' });
        filters.querySelector('summary').focus();
      }
    },
    'forum-thread': el => {
      const id = Number(el.dataset.id);
      if (!state.forumThreads.some(thread => thread.id === id)) return notify('No se encuentra esta publicación.', true);
      state.selectedThreadId = id;
      navigate('thread');
    },
    'close-thread': el => {
      const result = M.closeForumThread(state, Number(el.dataset.id));
      if (!result.ok) return notify(result.message, true);
      render();
      notify('Publicación cerrada en esta visita.');
    },
    'report-details': el => {
      const id = Number(el.dataset.id);
      if (!state.reports.some(report => report.id === id)) return notify('No se encuentra ese reporte.', true);
      state.lastReportId = id;
      navigate('pending');
    },
    'toggle-theme': () => {
      state.preferences.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      savePreferences(state.preferences.theme === 'dark' ? 'Modo nocturno activado.' : 'Modo diurno activado.');
      const themeSelect = document.querySelector('#settings-form [name="theme"]');
      if (themeSelect) themeSelect.value = state.preferences.theme;
    },
    sensor: el => {
      if (!M.PARKINGS.some(p => p.id === el.dataset.id)) return notify('No se encuentra ese sensor.', true);
      state.selectedParking = el.dataset.id;
      if (el.closest('#assistant-panel')) closeAssistant(false);
      navigate('sensor');
    },
    'toggle-assistant': () => {
      if (document.getElementById('assistant-panel').hidden) openAssistant();
      else closeAssistant();
    },
    'close-assistant': () => closeAssistant(),
    'ask-assistant': el => {
      const questions = { eventos: '¿Qué eventos cercanos hay?', zonas: '¿Cuál es el estado de las zonas?', barik: '¿Cómo vinculo mi Barik y presento un ticket?', guia: 'Guíame paso a paso para empezar.' };
      if (!Object.hasOwn(questions, el.dataset.id)) return notify('Esa guía no está disponible.', true);
      askAssistant(questions[el.dataset.id]);
    },
    'remove-ticket-photo': () => {
      clearTicketPhoto();
      const input = document.getElementById('ticket-file');
      if (input) input.value = '';
      updatePhotoPreview();
    },
    'ticket-details': el => {
      const id = Number(el.dataset.id);
      if (!state.ticketClaims.some(t => t.id === id)) return notify('No se encuentra ese justificante.', true);
      state.lastTicketId = id;
      navigate('ticket-status');
    },
    'validate-ticket': () => {
      const result = M.validateTicket(state, state.lastTicketId);
      if (!result.ok) return notify(result.message, true);
      if (ticketPhoto?.claimId === state.lastTicketId) clearTicketPhoto();
      render();
      notify(`Validación de ejemplo completada: +${result.award} puntos. La fotografía se ha descartado.`);
    },
    'unlink-barik': () => openModal('Desvincular tu Barik.', `<p>Se eliminarán el alias, los cuatro dígitos y la fotografía abierta. Los justificantes pendientes quedarán cancelados, sin conceder puntos. Los puntos ya obtenidos se mantienen durante esta visita.</p><div class="dialog-actions">${button('Cancelar', 'close-modal', { kind: 'secondary' })}${button('Desvincular y eliminar foto', 'confirm-unlink-barik')}</div>`),
    'confirm-unlink-barik': () => {
      const result = M.unlinkBarik(state);
      if (!result.ok) return notify(result.message, true);
      clearTicketPhoto();
      modal.close();
      navigate('barik');
      notify('Tarjeta desvinculada y fotografía eliminada.');
    },
    parking: el => {
      if (!M.PARKINGS.some(p => p.id === el.dataset.id)) return notify('No se encuentra ese aparcamiento.', true);
      state.selectedParking = el.dataset.id;
      navigate('parking');
    },
    filters: filtersModal,
    menu: () => {
      const opened = document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('menu-backdrop').hidden = !opened;
      document.getElementById('menu-button').setAttribute('aria-expanded', String(opened));
    },
    'close-menu': closeMenu,
    'close-modal': closeModal,
    destination: el => {
      state.destination = el.dataset.id;
      navigate('results');
    },
    'manual-location': () => {
      state.manualLocation = true;
      navigate('location');
    },
    refresh: () => {
      M.changeDataMode(state, 'fresh');
      render();
      notify('Lecturas de ejemplo actualizadas. No se ha consultado información en vivo.');
    },
    'select-route': el => {
      if (!['metro', 'car', 'bike'].includes(el.dataset.id)) return notify('Alternativa no disponible.', true);
      state.selectedMode = el.dataset.id;
      navigate('route');
    },
    'later-departure': () => {
      state.departure = '19:15';
      navigate('compare');
      notify('Salida cambiada a las 19:15. Los tiempos del escenario se han actualizado.');
    },
    'start-drive': () => {
      state.moving = true;
      state.muted = false;
      closeAssistant(false);
      navigate('drive');
      readSpeech('Mantén la atención en la vía. Estas indicaciones son de ejemplo, no navegación real. No interactúes mientras conduces.');
    },
    'stop-drive': () => {
      state.moving = false;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      navigate('route');
    },
    'toggle-voice': () => {
      state.muted = !state.muted;
      if (state.muted) {
        if ('speechSynthesis' in window) speechSynthesis.cancel();
      } else readSpeech('Mantén la atención en la vía. Sigue la señalización real. AparkaTu no proporciona navegación real en esta versión.');
      render();
    },
    'complete-journey': () => {
      const result = M.completeJourney(state);
      if (!result.ok) return notify(result.message, true);
      navigate('arrival');
    },
    'validate-report': () => {
      const result = M.validateReport(state, state.lastReportId);
      if (!result.ok) return notify(result.message, true);
      navigate('validated');
    },
    redeem: () => {
      const result = M.prepareRedemption(state);
      if (!result.ok) return notify(result.message, true);
      openModal('Un canje, solo de ejemplo.', `<p>Tarjeta personalizada <strong>•••• ${e(state.barik.lastFour)}</strong>.</p><p>Se descontarán <strong>100 puntos</strong> de tu saldo local de ${state.points}. No se realiza ninguna recarga Barik, pago ni transacción real.</p><p>Te quedarán <strong>${state.points - 100} puntos de ejemplo</strong>.</p><div class="dialog-actions">${button('Cancelar', 'close-modal', { kind: 'secondary' })}${button('Confirmar canje de ejemplo', 'confirm-redeem', { kind: 'green' })}</div>`);
    },
    'confirm-redeem': () => {
      const result = M.redeem(state);
      if (!result.ok) return notify(result.message, true);
      modal.close();
      navigate('redeemed');
    },
    'read-aloud': () => readSpeech('Una buena alternativa para ir a San Mamés. Primero, ve a P más R Leioa. Después, continúa en Metro, línea uno. Por último, camina unos cuatro minutos. El trayecto de ejemplo dura treinta y un minutos. La plaza no está reservada. Comprueba que puedes aparcar al llegar.'),
    'enable-reading': () => {
      state.preferences.font = 'lexend';
      state.preferences.spacing = 'wide';
      state.preferences.simple = true;
      savePreferences('Lectura adaptada activada en toda la web.');
      render();
    },
    'reset-preferences': () => {
      state.preferences = { ...M.DEFAULTS };
      savePreferences('Preferencias restablecidas.');
      render();
    },
    'clear-preferences': () => {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.warn('AparkaTu: no se pudieron borrar las preferencias.', error);
        notify('No se pudo acceder al almacenamiento para borrar las preferencias.', true);
        return;
      }
      state.preferences = { ...M.DEFAULTS };
      render();
      notify('Preferencias guardadas eliminadas. Se usan los ajustes iniciales.');
    },
    'toggle-public-data': () => {
      M.changeDataMode(state, state.dataMode === 'fresh' ? 'offline' : 'fresh');
      render();
    }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') !== '#main') {
      event.preventDefault();
      navigate(link.getAttribute('href').slice(1));
      return;
    }
    const el = event.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const action = el.dataset.action;
    if (state.moving && !['stop-drive', 'toggle-voice', 'menu', 'close-menu', 'close-assistant'].includes(action)) {
      notify('Primero confirma que estás parado. Las demás acciones están pausadas.', true);
      return;
    }
    if (!Object.hasOwn(actions, action)) {
      console.error('AparkaTu: acción desconocida', action);
      return notify('Esta acción no está disponible.', true);
    }
    actions[action](el);
  });
  const checked = (form, name) => form.elements.namedItem(name).checked;
  document.addEventListener('submit', event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (state.moving) return notify('No utilices formularios mientras conduces.', true);
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (form.id === 'assistant-form') {
      askAssistant(String(data.get('question')));
      form.reset();
    } else if (form.id === 'barik-form') {
      const result = M.linkBarik(state, { alias: String(data.get('alias')), lastFour: String(data.get('lastFour')), personalized: checked(form, 'personalized'), consent: checked(form, 'consent') });
      if (!result.ok) {
        document.getElementById('barik-error').textContent = result.message;
        document.getElementById('barik-error').hidden = false;
        return;
      }
      notify('Barik personalizada vinculada solo en esta visita. No se ha contactado con el operador.');
      navigate('ticket');
    } else if (form.id === 'ticket-form') {
      const errorNode = document.getElementById('ticket-error');
      if (!ticketPhoto || ticketPhoto.claimId || photoLoading) {
        errorNode.textContent = 'Selecciona y espera a que se compruebe una fotografía nueva del justificante.';
        errorNode.hidden = false;
        return;
      }
      const result = M.submitTicket(state, { parkingId: String(data.get('parking')), reference: String(data.get('reference')), image: ticketPhoto, stopped: checked(form, 'stopped'), intermodal: checked(form, 'intermodal') });
      if (!result.ok) {
        errorNode.textContent = result.message;
        errorNode.hidden = false;
        return;
      }
      ticketPhoto.claimId = result.ticket.id;
      navigate('ticket-status');
    } else if (form.id === 'destination-form' || form.id === 'location-form') {
      const destination = String(data.get('destination')).trim();
      const origin = form.id === 'location-form' ? String(data.get('origin')).trim() : state.origin;
      if (!destination || !origin) return notify('Escribe un origen y un destino válidos.', true);
      state.destination = destination;
      state.origin = origin;
      navigate('results');
    } else if (form.id === 'profile-form') {
      Object.assign(state.preferences, { pmr: checked(form, 'pmr'), stepFree: checked(form, 'stepFree'), resident: checked(form, 'resident'), vehicle: String(data.get('vehicle')), maxWalk: Number(data.get('maxWalk')) });
      savePreferences();
      navigate('results');
    } else if (form.id === 'filters-form') {
      Object.assign(state.preferences, { pmr: checked(form, 'pmr'), stepFree: checked(form, 'stepFree'), preferPr: checked(form, 'preferPr'), includeOTA: checked(form, 'includeOTA'), maxWalk: Number(data.get('maxWalk')) });
      savePreferences('Filtros aplicados sin relajar tus necesidades de acceso.');
      modal.close();
      navigate('results');
    } else if (form.id === 'departure-form') {
      const value = String(data.get('departure'));
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return notify('Introduce una hora válida.', true);
      state.departure = value;
      render();
      notify('Hora de salida actualizada.');
    } else if (form.matches('[data-report-form]')) {
      const errorNode = form.querySelector('[data-form-error]');
      const parkingId = String(data.get('parking'));
      if (!M.PARKINGS.some(p => p.id === parkingId)) return notify('Selecciona un aparcamiento válido.', true);
      state.selectedParking = parkingId;
      const result = M.submitReport(state, { status: String(data.get('observation')), stopped: checked(form, 'stopped') });
      if (!result.ok) {
        errorNode.textContent = result.message;
        errorNode.hidden = false;
        errorNode.scrollIntoView({ block: 'nearest' });
        return;
      }
      navigate('pending');
    } else if (form.id === 'forum-form' || form.id === 'forum-reply-form') {
      const result = form.id === 'forum-form'
        ? M.addForumThread(state, { category: String(data.get('category')), zone: String(data.get('zone')), title: String(data.get('title')), message: String(data.get('message')), availability: String(data.get('availability') || ''), stopped: checked(form, 'stopped') })
        : M.replyForumThread(state, { id: state.selectedThreadId, message: String(data.get('message')), stopped: checked(form, 'stopped') });
      if (!result.ok) {
        const errorNode = form.querySelector('[data-form-error]');
        errorNode.textContent = result.message;
        errorNode.hidden = false;
        return;
      }
      navigate('thread');
      notify('Guardado solo durante esta visita. No se ha publicado en Internet.');
    } else if (form.id === 'settings-form') {
      Object.assign(state.preferences, { theme: String(data.get('theme')), vision: String(data.get('vision')), font: String(data.get('font')), spacing: String(data.get('spacing')), simple: checked(form, 'simple'), alerts: checked(form, 'alerts') });
      savePreferences();
      render();
    } else {
      console.error('AparkaTu: formulario desconocido', form.id);
      notify('No se pudo procesar este formulario.', true);
    }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'ticket-file') chooseTicketPhoto(event.target.files[0]);
    if (event.target.name === 'parking' && event.target.closest('[data-report-form]')) {
      const parking = M.PARKINGS.find(p => p.id === event.target.value);
      if (!parking) return notify('No se encuentra el sensor seleccionado.', true);
      state.selectedParking = parking.id;
      const form = event.target.closest('[data-report-form]');
      form.querySelector('[data-report-sensor]').innerHTML = form.id === 'quick-report-form'
        ? `<p class="footnote">${e(parking.sensor.location)} · ubicación de ejemplo</p>` : sensorInfo(parking);
    }
    if (event.target.id === 'forum-category') {
      state.forumCategory = event.target.value;
      document.getElementById('forum-list').innerHTML = forumList();
    }
    if (event.target.name === 'category' && event.target.closest('#forum-form')) {
      const sharing = event.target.value === 'share';
      const field = document.getElementById('forum-availability-field');
      field.hidden = !sharing;
      field.querySelector('input').required = sharing;
    }
    if (event.target.id === 'connection-select') {
      M.changeDataMode(state, event.target.value);
      render();
      notify(state.dataMode === 'fresh' ? 'Lecturas locales actualizadas.' : 'Las plazas se muestran como desconocidas.');
    }
    if (event.target.name === 'vision') {
      document.body.dataset.vision = event.target.value;
      AparkaMaps.appearance();
    }
    if (event.target.name === 'font') document.body.dataset.font = event.target.value;
    if (event.target.name === 'spacing') document.body.dataset.spacing = event.target.value;
    if (event.target.name === 'theme') applyTheme(event.target.value);
  });
  modal.addEventListener('cancel', () => { state.redemptionPending = false; });
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      if (!document.getElementById('assistant-panel').hidden) closeAssistant();
    }
  });
  window.addEventListener('hashchange', () => navigate(location.hash.slice(1) || 'map', true));
  window.addEventListener('popstate', () => {
    const view = location.hash.slice(1) || 'map';
    if (view !== state.view) navigate(view, true);
  });
  document.getElementById('menu-button').innerHTML = icon('menu');
  document.getElementById('notification-button').innerHTML = icon('bell');
  document.getElementById('sidebar-leaf').innerHTML = icon('leaf');
  document.getElementById('assistant-toggle').innerHTML = icon('chat') + '<span>GaldeTU</span>';
  window.addEventListener('pagehide', () => {
    clearTicketPhoto();
    AparkaMaps.destroy();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) render();
  });
  let lastAvailability = '';
  setInterval(() => {
    state.now = M.DEMO_START + Math.floor((performance.now() - startTime) / 1000) * 1000;
    document.querySelectorAll('[data-clock]').forEach(n => { n.textContent = time(state.now).slice(0, 5); });
    document.querySelectorAll('[data-age]').forEach(n => {
      const p = M.PARKINGS.find(p => p.id === n.dataset.age);
      if (!p) return;
      const r = M.reading(p, state);
      n.textContent = `${time(r.updatedAt)} · hace ${ageText(r.ageMs)} · ${p.source}`;
    });
    AparkaMaps.refresh();
    const availability = M.PARKINGS.map(p => M.reading(p, state).status).join();
    if (lastAvailability && availability !== lastAvailability && ['map', 'results', 'parking', 'sensor', 'public', 'connection', 'impact'].includes(state.view)) {
      const active = document.activeElement;
      const focused = active?.form?.id && active.name ? { form: active.form.id, name: active.name, start: active.selectionStart, end: active.selectionEnd } : null;
      const drafts = Array.from(main.querySelectorAll('form')).map(form => ({
        id: form.id, values: Array.from(form.elements).filter(field => field.name && field.type !== 'file').map(field => ({ name: field.name, value: field.value, checked: field.checked }))
      }));
      const environmentOpen = main.querySelector('.environment-filters')?.open;
      render();
      for (const draft of drafts) {
        const form = document.getElementById(draft.id);
        if (!form) continue;
        for (const value of draft.values) {
          const field = form.elements.namedItem(value.name);
          if (!field) continue;
          field.value = value.value;
          if (typeof value.checked === 'boolean') field.checked = value.checked;
        }
      }
      const restoredFocus = focused ? document.getElementById(focused.form)?.elements.namedItem(focused.name) : null;
      if (restoredFocus) {
        restoredFocus.focus({ preventScroll: true });
        if (typeof focused.start === 'number' && typeof restoredFocus.setSelectionRange === 'function') restoredFocus.setSelectionRange(focused.start, focused.end);
      }
      const environment = main.querySelector('.environment-filters');
      if (environment && environmentOpen !== undefined) environment.open = environmentOpen;
    }
    lastAvailability = availability;
  }, 1000);
  navigate(location.hash.slice(1) || 'map', true);
  if (storageWarning) notify(storageWarning, true);
})();
