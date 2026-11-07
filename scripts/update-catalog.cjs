const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

async function updateCatalog() {
  const root = path.resolve(__dirname, '..');
  const model = vm.runInNewContext(await fs.readFile(path.join(root, 'model.js'), 'utf8') + '\nAparkaModel');
  const response = await fetch(model.CATALOG_SOURCE.downloadUrl, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`La fuente oficial ha respondido HTTP ${response.status}.`);
  const raw = await response.text();
  const payload = JSON.parse(raw);
  const records = model.parseOfficialParkings(payload);
  const snapshot = {
    schemaVersion: 1, retrievedAt: new Date().toISOString(), source: model.CATALOG_SOURCE,
    sourceSha256: crypto.createHash('sha256').update(raw).digest('hex'),
    sourceRecordCount: payload.aparcamientos.length, excludedRecords: payload.aparcamientos.length - records.length, records
  };
  const output = path.join(root, 'assets', 'data', 'parking-catalog.js');
  await fs.mkdir(path.dirname(output), { recursive: true });
  const temporary = `${output}.tmp`;
  try {
    await fs.writeFile(temporary, `globalThis.AparkaParkingCatalog = ${JSON.stringify(snapshot, null, 2)};\n`, 'utf8');
    await fs.rename(temporary, output);
  } finally {
    await fs.rm(temporary, { force: true });
  }
  console.log(`Catalogo oficial actualizado: ${records.length} aparcamientos de residentes; ${snapshot.excludedRecords} registros incompletos excluidos. Sin ocupacion en tiempo real.`);
}

updateCatalog().catch(error => {
  console.error(`No se ha sustituido el catalogo: ${error.message}`);
  process.exitCode = 1;
});