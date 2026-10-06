/* Generates legal/sources/<code>/<doc>.md for every jurisdiction × policy.
   Poetry-free single source of truth: js/policies-data.js. Run: node tools/generate-policy-docs.js */
const fs = require('fs'), path = require('path');
global.window = {};
require('../js/policies-data.js');
const DATA = window.LTAB_LEGAL_DATA;
const ROOT = path.join(__dirname, '..', 'legal', 'sources');

const JUR_FILE_CODE = { US:'us', CA:'ca', EU:'eu', UK:'uk', AE:'ae', SG:'sg', MY:'my', AU:'au', NZ:'nz' };

function md(c){
  const jurLabel = DATA.JURISDICTIONS[c.jur].label;
  const L = [];
  L.push('---');
  L.push(`title: "${c.meta.title}"`);
  L.push(`region: "${jurLabel}"`);
  L.push(`effective: "${c.meta.version}"`);
  L.push('---', '');
  L.push(`# ${c.meta.title}`);
  L.push(`_${c.meta.tag} · ${jurLabel} · Effective ${c.meta.version}_`, '');
  L.push(c.meta.intro, '');
  for(const b of c.blocks){
    if(b.h){ L.push('', '## ' + b.h, ''); }
    else if(b.li){ L.push('- ' + b.li); }
    else { if(L.length && !L[L.length-1].startsWith('- ') && L[L.length-1] !== '') L.push(''); L.push(b.p); }
  }
  if(c.extras.length){
    L.push('', `## Applies in ${c.jur.label}`, '');
    c.extras.forEach(t=>L.push(t, ''));
  }
  L.push('', `## Region specifics — ${c.jur.label}`, '');
  L.push(`**Laws that apply here**`, '');
  c.annex.laws.forEach(l=>{ L.push(`- **${l.name}** — ${l.note}`); });
  L.push('', `**Regulator:** ${c.annex.regulator} (${c.annex.regulatorUrl})`);
  L.push('', `**Your rights**`, '');
  c.annex.rights.forEach(r=>L.push('- ' + r));
  L.push('', `**Timing:** ${c.annex.rightsTiming}`);
  L.push('', `**Consent mode:** ${c.annex.consentMode === 'opt-in' ? 'Asks first (prior opt-in consent)' : 'Tells you first (notice)'}`);
  L.push('', `**Data leaving your country:** ${c.annex.transferNote}`);
  L.push('', `**How long we keep it:** ${c.annex.retentionNote}`);
  L.push('', `**Questions:** ${c.contact} — a human answers.`);
  L.push('', `---`, '', `Template ${c.meta.version} by LTAB AI. Have your own counsel confirm it for your business before relying on it as final.`);
  L.push('', `AUTO-GENERATED from js/policies-data.js — edit the data file and re-run tools/generate-policy-docs.js instead of editing this file.`);
  return L.join('\n') + '\n';
}

let n = 0;
for(const jur of Object.keys(JUR_FILE_CODE)){
  const dir = path.join(ROOT, JUR_FILE_CODE[jur]);
  fs.mkdirSync(dir, { recursive: true });
  for(const docKey of Object.keys(DATA.DOCS)){
    const c = DATA.composeDoc(docKey, jur);
    fs.writeFileSync(path.join(dir, c.doc.slug + '.md'), md(c));
    n++;
  }
}
console.log(`wrote ${n} files under legal/sources/`);
