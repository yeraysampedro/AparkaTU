const AparkaI18n = (() => {
  'use strict';
  const messages = AparkaEuskara.messages;
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  const excluded = 'script, style, noscript, code, pre, [translate="no"], [data-user-content]';
  const missing = new Set();
  let language = 'es';
  let debug = false;
  let observer;
  let observedRoot;
  const canonical = value => String(value).normalize('NFC').replace(/\s+/g, ' ').trim();
  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = AparkaEuskara.patterns.map(([source, target, translatedNames = []]) => {
    const names = [];
    const expression = source.split(/(\{\w+\})/).map(part => {
      if (!/^\{\w+\}$/.test(part)) return escapeRegex(part);
      names.push(part.slice(1, -1));
      return ['count', 'number', 'minutes', 'distance', 'amount', 'year', 'day', 'value', 'total', 'current'].includes(part.slice(1, -1)) ? '([\\d.,+−-]+)' : '(.+?)';
    }).join('');
    return { expression: new RegExp(`^${expression}$`, 'u'), names, target, translatedNames };
  });
  function translateMessage(value, depth = 0) {
    const source = canonical(value);
    if (!source || depth > 5) return String(value);
    if (/\n/.test(String(value))) return String(value).split(/(\n+)/).map((part, index) => index % 2 ? part : translateMessage(part, depth + 1)).join('');
    let translated = Object.hasOwn(messages, source) ? messages[source] : null;
    if (translated === null) {
      for (const pattern of patterns) {
        const match = pattern.expression.exec(source);
        if (!match) continue;
        translated = pattern.target.replace(/\{(\w+)\}/g, (_, name) => {
          const value = match[pattern.names.indexOf(name) + 1];
          return pattern.translatedNames.includes(name) ? translateMessage(value, depth + 1) : value;
        });
        break;
      }
    }
    if (translated === null && /\n| · | → /.test(String(value))) {
      const parts = String(value).split(/(\n+| · | → )/);
      return parts.map((part, index) => index % 2 ? part : translateMessage(part, depth + 1)).join('');
    }
    if (translated === null) {
      if (debug && /[a-záéíóúñ]{2}/i.test(source) && !/^(?=.*\d)[A-Z\d-]+$/.test(source)) missing.add(source);
      return String(value);
    }
    const original = String(value);
    return original.match(/^\s*/)[0] + translated + original.match(/\s*$/)[0];
  }
  function text(value) {
    return language === 'eu' ? translateMessage(value) : String(value);
  }
  function ignored(element) {
    return !element || !!element.closest(excluded);
  }
  function translateText(node) {
    if (ignored(node.parentElement) || node.parentElement.closest('textarea, [contenteditable="true"]')) return;
    const previous = textSources.get(node);
    const source = previous && node.nodeValue === previous.output ? previous.source : node.nodeValue;
    const output = text(source);
    textSources.set(node, { source, output });
    if (node.nodeValue !== output) node.nodeValue = output;
  }
  function translateAttribute(element, attribute) {
    if (ignored(element) || !element.hasAttribute(attribute)) return;
    const records = attributeSources.get(element) || {};
    const current = element.getAttribute(attribute);
    const previous = records[attribute];
    const source = previous && current === previous.output ? previous.source : current;
    const output = text(source);
    records[attribute] = { source, output };
    attributeSources.set(element, records);
    if (current !== output) element.setAttribute(attribute, output);
  }
  function translateTree(root) {
    if (root.nodeType === 3) return translateText(root);
    if (root.nodeType !== 1 || ignored(root)) return;
    for (const attribute of attributes) translateAttribute(root, attribute);
    for (const element of root.querySelectorAll('[aria-label], [title], [placeholder], [alt]')) {
      for (const attribute of attributes) translateAttribute(element, attribute);
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateText(walker.currentNode);
  }
  function reconnect() {
    if (observer && observedRoot) observer.observe(observedRoot, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
  }
  function update(callback) {
    const pending = observer?.takeRecords() || [];
    observer?.disconnect();
    for (const record of pending) processMutation(record);
    callback();
    reconnect();
  }
  function processMutation(record) {
    if (record.type === 'characterData') translateText(record.target);
    if (record.type === 'attributes') translateAttribute(record.target, record.attributeName);
    if (record.type === 'childList') for (const node of record.addedNodes) translateTree(node);
  }
  function setLanguage(next) {
    if (!['es', 'eu'].includes(next)) throw new RangeError('Unsupported language');
    language = next;
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    update(() => translateTree(document.documentElement));
    const selector = document.getElementById('language-select');
    if (selector) selector.value = language;
  }
  function start(root) {
    observedRoot = root;
    observer = new MutationObserver(records => {
      observer.disconnect();
      for (const record of records) processMutation(record);
      reconnect();
    });
    translateTree(root);
    reconnect();
  }
  function question(value) {
    return String(value).replace(/benetako datuak|iturri ofizial\w*/gi, 'datos oficiales')
      .replace(/pribatutasun\w*/gi, 'privacidad').replace(/irisgarritasun\w*/gi, 'accesibilidad')
      .replace(/aparkaleku\w*|aparkat\w*/gi, 'aparcar').replace(/egoera/gi, 'estado')
      .replace(/ibilbide\w*|alderatu/gi, 'comparar rutas').replace(/egiaztagiri\w*|tiket\w*/gi, 'ticket')
      .replace(/puntu\w*|sariak/gi, 'puntos').replace(/gaueko|modu iluna/gi, 'nocturno')
      .replace(/foroa|auzoko\w*/gi, 'foro').replace(/laguntza|nola hasi/gi, 'ayuda')
      .replace(/babesleku\w*|airearen kalitatea/gi, 'bateratu').replace(/aurrezpen\w*|isuri\w*/gi, 'ahorro')
      .replace(/bero\w*|itzal\w*|eguraldi\w*/gi, 'clima');
  }
  return Object.freeze({ text, translateMessage, setLanguage, start, question, get language() { return language; }, get locale() { return language === 'eu' ? 'eu-ES' : 'es-ES'; }, audit(enabled = true) { debug = enabled; missing.clear(); }, missing() { return [...missing].sort(); } });
})();