const AparkaModel = (() => {
  'use strict';
  const DEMO_START = Date.parse('2026-07-15T17:43:00+02:00');
  const MAX_AGE_MS = 3 * 60 * 1000;
  const MAX_TICKET_BYTES = 5 * 1024 * 1024;
  const TICKET_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);
  const TICKET_REWARD = 30;
  const CLOCK_FORMAT = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Madrid' });
  const DEFAULTS = Object.freeze({
    pmr: true, stepFree: true, includeOTA: false, preferPr: true,
    resident: false, vehicle: 'ECO', maxWalk: 300, alerts: true,
    vision: 'standard', font: 'inter', spacing: 'normal', simple: false, theme: 'light'
  });
  const PARKINGS = Object.freeze([
    Object.freeze({ id: 'leioa', name: 'P+R Leioa', type: 'pr', coordinates: Object.freeze([43.318056, -2.991944]), mapReference: 'Entorno de la estación de Leioa · ubicación aproximada del ejemplo', spaces: 42, pmr: 2, stepFree: true, walk: 260, residentOnly: false, vehicles: ['B', 'C', 'ECO', '0'], age: 42, margin: 7, source: 'Sensor LEI-ACC-01', connection: 'Metro L1 · conexión a San Mamés', sensor: Object.freeze({ id: 'LEI-ACC-01', location: 'P+R Leioa · acceso principal · carril de entrada 1 · barrera A', device: 'Contador de entradas y salidas', coverage: 'Ocupación agregada del aparcamiento; no confirma una plaza concreta.' }) }),
    Object.freeze({ id: 'indautxu', name: 'Indautxu', type: 'parking', coordinates: Object.freeze([43.260861, -2.940236]), mapReference: 'Entorno de la estación de Indautxu · ubicación aproximada del ejemplo', spaces: 18, pmr: 1, stepFree: true, walk: 180, residentOnly: false, vehicles: ['C', 'ECO', '0'], age: 20, margin: 4, source: 'Sensor IND-P1-03', connection: 'Tramo a pie sin escalones · ejemplo', sensor: Object.freeze({ id: 'IND-P1-03', location: 'Parking Indautxu · planta −1 · sector B · acceso a fila 3', device: 'Contador de ocupación por sector', coverage: 'Ocupación del sector B; datos agregados de plazas.' }) }),
    Object.freeze({ id: 'abando', name: 'Abando · OTA', type: 'ota', coordinates: Object.freeze([43.26139, -2.92944]), mapReference: 'Zona de Abando · ubicación aproximada del ejemplo', spaces: 12, pmr: 1, stepFree: true, walk: 90, residentOnly: true, vehicles: ['C', 'ECO', '0'], age: 1130, margin: 5, source: 'Sensor ABA-OTA-07', connection: 'Zona residente · condiciones simuladas', sensor: Object.freeze({ id: 'ABA-OTA-07', location: 'Abando · zona OTA de referencia · tramo 2 · poste de lectura 07', device: 'Nodo de sensores de plazas reguladas', coverage: 'Agregado del tramo 2. La lectura actual ha caducado.' }) })
  ]);
  const fail = (code, message) => ({ ok: false, code, message });
  function formatTime(value) {
    return CLOCK_FORMAT.format(value);
  }
  function formatAge(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds < 60 ? `${seconds} s` : `${Math.floor(seconds / 60)} min ${seconds % 60} s`;
  }
  function createState(preferences = DEFAULTS) {
    return {
      preferences: { ...DEFAULTS, ...preferences }, view: 'welcome', history: [],
      now: DEMO_START, readingBase: DEMO_START, dataMode: 'fresh',
      origin: 'Getxo', destination: 'San Mamés', departure: '17:43',
      selectedParking: 'leioa', selectedMode: 'metro', manualLocation: false,
      moving: false, muted: false, points: 110, reports: [], lastReportId: null,
      completedModes: [], redemptionPending: false, redemptions: 0, storageWarning: '',
      barik: null, barikSequence: 0, ticketClaims: [], lastTicketId: null
    };
  }
  function reading(parking, state) {
    const updatedAt = state.readingBase - parking.age * 1000;
    const ageMs = Math.max(0, state.now - updatedAt);
    const status = state.dataMode === 'offline' ? 'offline'
      : state.dataMode === 'stale' || ageMs > MAX_AGE_MS ? 'stale' : 'fresh';
    return { status, updatedAt, ageMs, available: status === 'fresh' ? parking.spaces : null };
  }
  function changeDataMode(state, mode) {
    if (!['fresh', 'stale', 'offline'].includes(mode)) throw new RangeError('Unknown data mode');
    state.dataMode = mode;
    if (mode === 'fresh') state.readingBase = state.now;
    if (mode === 'stale') state.readingBase = state.now - 15 * 60 * 1000;
  }
  function compatible(parking, preferences) {
    return (!preferences.pmr || parking.pmr > 0)
      && (!preferences.stepFree || parking.stepFree)
      && (preferences.includeOTA || parking.type !== 'ota')
      && (!parking.residentOnly || preferences.resident)
      && parking.vehicles.includes(preferences.vehicle)
      && parking.walk <= preferences.maxWalk;
  }
  function results(state) {
    return PARKINGS.filter(p => compatible(p, state.preferences)).sort((a, b) => {
      if (state.preferences.preferPr && (a.type === 'pr') !== (b.type === 'pr')) return a.type === 'pr' ? -1 : 1;
      return a.walk - b.walk;
    });
  }
  function journey(mode, departure = '17:43') {
    if (!['car', 'metro', 'bike'].includes(mode)) throw new RangeError('Unknown transport mode');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(departure)) throw new RangeError('Invalid departure time');
    const [hours, minutes] = departure.split(':').map(Number);
    const late = hours * 60 + minutes >= 19 * 60 + 15;
    const steps = mode === 'metro'
      ? [{ label: 'Conduce a P+R Leioa', minutes: 8, icon: 'car' }, { label: 'Aparca y accede al Metro', minutes: 2, icon: 'access' }, { label: 'Metro L1 → San Mamés', minutes: 17, icon: 'train' }, { label: 'Paseo sin escalones', minutes: 4, icon: 'pin' }]
      : mode === 'car'
        ? [{ label: 'Conduce hacia el destino', minutes: 23, icon: 'car' }, { label: 'Busca una plaza compatible', minutes: late ? 6 : 18, icon: 'search' }, { label: 'Completa el tramo a pie', minutes: 6, icon: 'pin' }]
        : [{ label: 'Recorrido en bici', minutes: 34, icon: 'bike' }, { label: 'Último tramo a pie', minutes: 2, icon: 'pin' }];
    const duration = steps.reduce((sum, step) => sum + step.minutes, 0);
    const arrivalMinutes = hours * 60 + minutes + duration;
    const arrival = `${String(Math.floor(arrivalMinutes / 60) % 24).padStart(2, '0')}:${String(arrivalMinutes % 60).padStart(2, '0')}${arrivalMinutes >= 1440 ? ' (+1 día)' : ''}`;
    return { mode, steps, duration, arrival, uncertainty: mode === 'car' ? 9 : mode === 'metro' ? 4 : 5 };
  }
  function submitReport(state, { status, stopped }) {
    if (state.moving || !stopped) return fail('NOT_STOPPED', 'Confirma que estás parado antes de enviar un reporte.');
    if (!['free', 'occupied', 'verify'].includes(status)) return fail('INVALID_REPORT', 'Selecciona qué has observado.');
    const parking = PARKINGS.find(p => p.id === state.selectedParking);
    if (!parking) return fail('NO_SENSOR', 'Selecciona un aparcamiento con un sensor identificado.');
    const report = { id: state.reports.length + 1, observation: status, parkingId: parking.id, sensorId: parking.sensor.id, submittedAt: state.now, validated: false };
    state.reports.push(report);
    state.lastReportId = report.id;
    return { ok: true, report };
  }
  function validateReport(state, id) {
    const report = state.reports.find(item => item.id === id);
    if (!report) return fail('NO_REPORT', 'Primero envía un reporte de ejemplo.');
    if (report.validated) return fail('ALREADY_VALIDATED', 'Este reporte ya fue validado. No se duplican los puntos.');
    report.validated = true;
    state.points += 10;
    return { ok: true, points: state.points };
  }
  function completeJourney(state) {
    if (state.moving) return fail('MOVING', 'Finaliza el modo conducción cuando estés parado.');
    if (state.completedModes.includes(state.selectedMode)) return fail('ALREADY_COMPLETED', 'Este recorrido de ejemplo ya se completó.');
    state.completedModes.push(state.selectedMode);
    return { ok: true, requiresProof: state.selectedMode === 'metro' };
  }
  function linkBarik(state, { alias, lastFour, personalized, consent }) {
    if (state.moving) return fail('MOVING', 'Vincula la tarjeta solo cuando estés parado.');
    if (state.barik) return fail('ALREADY_LINKED', 'Desvincula primero la tarjeta actual.');
    if (!personalized || !consent) return fail('CONSENT_REQUIRED', 'Confirma que la tarjeta es personalizada y aceptas la vinculación local.');
    if (typeof alias !== 'string' || !alias.trim() || alias.trim().length > 40 || !/^\d{4}$/.test(lastFour)) return fail('INVALID_CARD', 'Indica un alias y únicamente los cuatro últimos dígitos de la tarjeta.');
    state.barikSequence += 1;
    state.barik = { id: state.barikSequence, alias: alias.trim(), lastFour };
    return { ok: true };
  }
  function unlinkBarik(state) {
    if (state.moving) return fail('MOVING', 'Gestiona la tarjeta solo cuando estés parado.');
    state.barik = null;
    state.redemptionPending = false;
    state.ticketClaims.filter(t => t.status === 'pending').forEach(t => { t.status = 'cancelled'; });
    return { ok: true };
  }
  function submitTicket(state, { parkingId, reference, image, stopped, intermodal }) {
    if (state.moving || !stopped) return fail('NOT_STOPPED', 'Confirma que estás parado para adjuntar el justificante.');
    if (!state.barik) return fail('NO_BARIK', 'Vincula primero una tarjeta Barik personalizada.');
    if (state.dataMode === 'offline') return fail('OFFLINE', 'Sin conexión, el justificante puede previsualizarse pero no enviarse a validar.');
    if (!PARKINGS.some(p => p.id === parkingId && p.type === 'pr')) return fail('NOT_PR', 'El ticket debe corresponder a un parking disuasorio P+R.');
    if (!intermodal) return fail('NOT_INTERMODAL', 'Confirma que combinaste el parking con transporte público.');
    const normalized = typeof reference === 'string' ? reference.trim().toUpperCase() : '';
    if (!/^[A-Z0-9][A-Z0-9 /-]{2,39}$/.test(normalized)) return fail('INVALID_REFERENCE', 'Escribe una referencia de ticket de 3 a 40 caracteres: letras, números, espacios, / o guiones.');
    if (!image || !TICKET_IMAGE_TYPES.includes(image.type) || !(image.size > 0 && image.size <= MAX_TICKET_BYTES) || !/^[a-f0-9]{64}$/.test(image.fingerprint)) return fail('INVALID_IMAGE', 'Selecciona una foto válida JPEG, PNG o WebP de hasta 5 MB.');
    if (state.ticketClaims.some(t => t.status !== 'cancelled' && (t.fingerprint === image.fingerprint || (t.parkingId === parkingId && t.reference === normalized)))) return fail('DUPLICATE_TICKET', 'Este ticket o esta fotografía ya se han presentado. No se duplican los puntos.');
    const ticket = { id: state.ticketClaims.length + 1, parkingId, reference: normalized, fingerprint: image.fingerprint, barikId: state.barik.id, submittedAt: state.now, status: 'pending' };
    state.ticketClaims.push(ticket);
    state.lastTicketId = ticket.id;
    return { ok: true, ticket };
  }
  function validateTicket(state, id) {
    if (state.moving) return fail('MOVING', 'Completa esta acción cuando estés parado.');
    const ticket = state.ticketClaims.find(t => t.id === id);
    if (!ticket || ticket.status !== 'pending') return fail('NOT_PENDING', 'Este justificante no está pendiente de validación.');
    if (!state.barik || state.barik.id !== ticket.barikId) return fail('CARD_CHANGED', 'La tarjeta vinculada al justificante ya no está disponible.');
    if (state.dataMode === 'offline') return fail('OFFLINE', 'Recupera la conexión de ejemplo antes de validar.');
    ticket.status = 'validated';
    state.points += TICKET_REWARD;
    return { ok: true, award: TICKET_REWARD };
  }
  function prepareRedemption(state) {
    if (!state.barik) return fail('NO_BARIK', 'Vincula una tarjeta Barik personalizada antes de canjear.');
    if (state.points < 100) return fail('INSUFFICIENT_POINTS', 'Necesitas 100 puntos de ejemplo para simular este canje.');
    state.redemptionPending = true;
    return { ok: true };
  }
  function redeem(state) {
    if (!state.redemptionPending) return fail('NO_CONFIRMATION', 'Abre y confirma el canje de ejemplo primero.');
    if (!state.barik) return fail('NO_BARIK', 'La tarjeta debe seguir vinculada para completar el canje.');
    if (state.points < 100) {
      state.redemptionPending = false;
      return fail('INSUFFICIENT_POINTS', 'No hay suficientes puntos de ejemplo.');
    }
    state.redemptionPending = false;
    state.points -= 100;
    state.redemptions += 1;
    return { ok: true, points: state.points };
  }
  function validPreferences(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const booleans = ['pmr', 'stepFree', 'includeOTA', 'preferPr', 'resident', 'alerts', 'simple'];
    return Object.keys(DEFAULTS).every(key => key === 'theme' || Object.hasOwn(value, key))
      && booleans.every(key => typeof value[key] === 'boolean')
      && ['B', 'C', 'ECO', '0'].includes(value.vehicle)
      && [50, 100, 300, 600].includes(value.maxWalk)
      && ['standard', 'deuteranopia', 'protanopia', 'tritanopia'].includes(value.vision)
      && ['inter', 'lexend'].includes(value.font)
      && ['normal', 'wide'].includes(value.spacing)
      && (!Object.hasOwn(value, 'theme') || ['light', 'dark'].includes(value.theme));
  }
  return Object.freeze({ DEMO_START, MAX_AGE_MS, MAX_TICKET_BYTES, TICKET_IMAGE_TYPES, TICKET_REWARD, DEFAULTS, PARKINGS, formatTime, formatAge, createState, reading, changeDataMode, compatible, results, journey, submitReport, validateReport, completeJourney, linkBarik, unlinkBarik, submitTicket, validateTicket, prepareRedemption, redeem, validPreferences });
})();
