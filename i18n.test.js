const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const i18n = vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'locales/eu.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'i18n.js'), 'utf8') + '\nAparkaI18n');

test('Basque translation handles exact messages, interpolation and whitespace', () => {
  i18n.setLanguage('eu');
  assert.equal(i18n.text('Encuentra aparcamiento en Bizkaia.'), 'Aurkitu aparkalekua Bizkaian.');
  assert.equal(i18n.text('  Buscar '), '  Bilatu ');
  assert.equal(i18n.text('6 avisos de ejemplo'), 'Adibidezko 6 abisu');
  assert.equal(i18n.text('Bilbao \u00b7 ejemplo'), 'Bilbao \u00b7 adibidea');
  assert.equal(i18n.text('Opciones en Buscar'), 'Aukerak: Buscar');
});

test('Spanish round trips retain source text and unsupported languages are rejected', () => {
  i18n.setLanguage('es');
  assert.equal(i18n.text('Buscar'), 'Buscar');
  assert.throws(() => i18n.setLanguage('fr'));
  assert.equal(i18n.language, 'es');
});

test('multi-step assistant messages preserve lines and translate each step', () => {
  i18n.setLanguage('eu');
  assert.equal(i18n.text('1. Ajusta tu perfil de acceso.\n2. Una plaza indicada nunca queda reservada.'), '1. Egokitu zure sarbide-profila.\n2. Adierazitako plaza ez da inoiz erreserbatzen.');
  assert.equal(i18n.text('7 de diciembre de 2026'), '2026ko abenduaren 7a');
});

test('every configured message and every mobility alert has a complete translation', () => {
  i18n.setLanguage('eu');
  const dictionary = vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'locales/eu.js'), 'utf8') + '\nAparkaEuskara');
  for (const [source, target] of Object.entries(dictionary.messages)) assert.equal(i18n.text(source), target, source);
  for (const [source, target] of dictionary.patterns) {
    const names = new Set(source.match(/\{\w+\}/g) || []);
    for (const placeholder of target.match(/\{\w+\}/g) || []) assert.ok(names.has(placeholder), source);
  }
  const model = vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'model.js'), 'utf8') + '\nAparkaModel');
  for (const category of Object.values(model.ALERT_CATEGORIES)) assert.notEqual(i18n.text(category), category);
  for (const alert of model.MOBILITY_ALERTS) {
    for (const field of ['title', 'situation', 'advice']) assert.notEqual(i18n.text(alert[field]), alert[field]);
  }
});