const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const model = vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'model.js'), 'utf8') + '\nAparkaModel');

test('the initial catalogue covers coast and inland Bizkaia', () => {
  const state = model.createState();
  assert.equal(state.destination, 'Bizkaia');
  assert.equal(model.MUNICIPALITIES.length, 21);
  const municipalities = new Set(model.results(state).map(parking => parking.municipality));
  for (const municipality of model.MUNICIPALITIES) assert.ok(municipalities.has(municipality.id), municipality.name);
  assert.equal(new Set(model.PARKINGS.map(parking => parking.id)).size, model.PARKINGS.length);
  assert.equal(new Set(model.PARKINGS.map(parking => parking.sensor.id)).size, model.PARKINGS.length);
});

test('each municipality returns only its own sample parkings', () => {
  for (const municipality of model.MUNICIPALITIES) {
    const state = model.createState();
    state.destination = municipality.name;
    const results = model.results(state);
    assert.ok(results.length > 0, municipality.name);
    assert.ok(results.every(parking => parking.municipality === municipality.id), municipality.name);
  }
});

test('place aliases and accents are normalized without substring collisions', () => {
  for (const [query, expected] of [['Gernika', 'gernika'], ['Zornotza', 'amorebieta'], ['Orduna', 'orduna'], ['Urdu\u00f1a', 'orduna'], ['Santurce', 'santurtzi'], ['San Mames', 'bilbao'], ['centro de Durango', 'durango']]) {
    assert.equal(model.municipalityFor(query)?.id, expected);
  }
  assert.equal(model.municipalityFor('Durangooo'), null);
});

test('unknown destinations do not fall back to Bilbao or the whole territory', () => {
  const state = model.createState();
  for (const query of ['Madrid', 'Mundaka', '', '<script>alert(1)</script>']) {
    state.destination = query;
    assert.equal(model.results(state).length, 0, query);
  }
  assert.ok(model.isTerritory('Vizcaya'));
  assert.ok(model.isTerritory(' BIZKAIA '));
});

test('municipal filtering preserves accessibility constraints', () => {
  const state = model.createState();
  state.destination = 'Durango';
  state.preferences.maxWalk = 50;
  assert.equal(model.results(state).length, 0);
  state.preferences.maxWalk = 300;
  assert.equal(model.results(state).length, 1);
  state.destination = 'Bilbao';
  assert.ok(model.results(state).every(parking => parking.type !== 'ota'));
});

test('new sensors obey expiry and offline rules', () => {
  const state = model.createState();
  const parking = model.PARKINGS.find(item => item.id === 'durango');
  assert.equal(model.reading(parking, state).available, parking.spaces);
  model.changeDataMode(state, 'offline');
  assert.equal(model.reading(parking, state).available, null);
  model.changeDataMode(state, 'fresh');
  state.now += model.MAX_AGE_MS + 1;
  assert.equal(model.reading(parking, state).available, null);
});

test('journey estimates are restricted to the explicit reference trip', () => {
  const state = model.createState();
  assert.equal(model.journeyOptions(state).length, 0);
  state.destination = 'Durango';
  assert.equal(model.journeyOptions(state).length, 0);
  state.destination = 'San Mames';
  assert.equal(model.journeyOptions(state).length, 3);
  state.origin = 'Bermeo';
  assert.equal(model.journeyOptions(state).length, 0);
});

test('the forum accepts every municipality in the territorial catalogue', () => {
  for (const municipality of model.MUNICIPALITIES) {
    const state = model.createState();
    const result = model.addForumThread(state, { category: 'question', zone: municipality.name, title: 'Consulta de acceso', message: 'Como consultar las condiciones de acceso?', stopped: true });
    assert.equal(result.ok, true, municipality.name);
  }
});

const officialFixture = { nombre: 'Alameda Mazarredo', direccion: 'Abandoibarra hiribidea 1', municipio: 'Bilbao', distrito: 'Abando', barrio: 'Abando', totalPlazasResidentes: 95, plazasLibres: 95, plazasMovilidadReducida: 'S\u00ed' };

test('official resident inventory never becomes live parking availability', () => {
  const [record] = model.parseOfficialParkings({ aparcamientos: [officialFixture] });
  assert.equal(record.capacity, 95);
  assert.equal(record.available, null);
  assert.equal(record.coordinates, null);
  assert.equal(record.updatedAt, null);
  assert.equal(record.residentOnly, true);
  assert.equal(record.sourceId, model.CATALOG_SOURCE.id);
});

test('published PMR provision does not imply step-free access or a free PMR space', () => {
  for (const [value, expected] of [['S\u00ed', true], ['No', false], ['--', null], [undefined, null]]) {
    const [record] = model.parseOfficialParkings({ aparcamientos: [{ ...officialFixture, plazasMovilidadReducida: value }] });
    assert.equal(record.pmr, expected);
    assert.equal(record.stepFree, null);
    assert.equal(record.available, null);
  }
});

test('official inventory rejects malformed and duplicate records', () => {
  for (const payload of [null, {}, { aparcamientos: [] }, { aparcamientos: [{}] }, { aparcamientos: [officialFixture, officialFixture] }]) {
    assert.throws(() => model.parseOfficialParkings(payload));
  }
  const [record] = model.parseOfficialParkings({ aparcamientos: [{ ...officialFixture, totalPlazasResidentes: 'sin dato' }] });
  assert.equal(record.capacity, null);
});

test('incomplete official records are excluded without inventing addresses', () => {
  const records = model.parseOfficialParkings({ aparcamientos: [officialFixture, { nombre: null, direccion: '' }, null] });
  assert.equal(records.length, 1);
  assert.equal(records[0].address, officialFixture.direccion);
});

test('official inventory search is accent-insensitive and does not substitute other municipalities', () => {
  const records = model.parseOfficialParkings({ aparcamientos: [officialFixture] });
  assert.equal(model.officialCatalogResults(records, 'Bilbao Abando').length, 1);
  assert.equal(model.officialCatalogResults(records, 'Mazarredo').length, 1);
  assert.equal(model.officialCatalogResults(records, 'Durango').length, 0);
  assert.equal(model.officialCatalogResults(records, '<script>').length, 0);
});

test('the bundled official snapshot preserves provenance and unknown values', () => {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'assets/data/parking-catalog.js'), 'utf8'), context);
  const snapshot = context.AparkaParkingCatalog;
  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.source.url, model.CATALOG_SOURCE.url);
  assert.equal(snapshot.source.downloadUrl, model.CATALOG_SOURCE.downloadUrl);
  assert.ok(Number.isFinite(Date.parse(snapshot.retrievedAt)));
  assert.match(snapshot.sourceSha256, /^[a-f0-9]{64}$/);
  assert.ok(snapshot.records.length > 0);
  assert.equal(snapshot.sourceRecordCount, snapshot.records.length + snapshot.excludedRecords);
  assert.equal(new Set(snapshot.records.map(record => record.id)).size, snapshot.records.length);
  for (const record of snapshot.records) {
    assert.ok(record.name && record.address);
    assert.equal(record.sourceId, snapshot.source.id);
    assert.equal(record.available, null);
    assert.equal(record.coordinates, null);
    assert.equal(record.stepFree, null);
    assert.equal(record.residentOnly, true);
  }
});

test('failed official updates preserve the previous snapshot', async () => {
  const snapshotPath = path.join(__dirname, 'assets/data/parking-catalog.js');
  const before = fs.readFileSync(snapshotPath, 'utf8');
  const updater = fs.readFileSync(path.join(__dirname, 'scripts/update-catalog.cjs'), 'utf8');
  for (const response of [{ ok: false, status: 503 }, { ok: true, text: async () => '{"aparcamientos":[]}' }]) {
    const processStub = { exitCode: 0 };
    const messages = [];
    await vm.runInNewContext(updater, {
      require, __dirname: path.join(__dirname, 'scripts'), AbortSignal,
      fetch: async () => response, process: processStub,
      console: { log: message => messages.push(message), error: message => messages.push(message) }
    });
    assert.equal(processStub.exitCode, 1);
    assert.equal(messages.length, 1);
    assert.equal(fs.readFileSync(snapshotPath, 'utf8'), before);
  }
});