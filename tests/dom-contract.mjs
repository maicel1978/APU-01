/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Contrato estático mínimo entre index.html y la UI para evitar arranques rotos.*
**/

import { readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');

const REQUIRED_DOM_CONTRACT = [
  ['#audio-file', /id="audio-file"/],
  ['.dropzone', /class="[^"]*dropzone/],
  ['input[name="output-mode"]', /name="output-mode"/],
  ['[data-mode-summary]', /data-mode-summary/],
  ['[data-mode-help]', /data-mode-help/],
  ['#status-summary', /id="status-summary"/],
  ['[data-file-card]', /data-file-card/],
  ['[data-file-name]', /data-file-name/],
  ['[data-file-meta]', /data-file-meta/],
  ['[data-status-badge]', /data-status-badge/],
  ['[data-worker-dot]', /data-worker-dot/],
  ['[data-worker-text]', /data-worker-text/],
  ['[data-progress-text]', /data-progress-text/],
  ['[data-progress-percent]', /data-progress-percent/],
  ['[data-progress-bar]', /data-progress-bar/],
  ['[data-convert]', /data-convert/],
  ['[data-cancel]', /data-cancel/],
  ['[data-reset]', /data-reset/],
  ['[data-result-text]', /data-result-text/],
  ['[data-download]', /data-download/],
  ['[data-manifest-download]', /data-manifest-download/],
  ['[data-message]', /data-message/],
  ['[data-error]', /data-error/],
];

let failures = 0;

for (const [selector, pattern] of REQUIRED_DOM_CONTRACT) {
  report(pattern.test(html), `index.html expone ${selector}`);
}

report(/rel="manifest"/.test(html), 'index.html enlaza manifest.json');
report(/src\/styles\/components\.css/.test(html), 'index.html carga components.css');
report(/rel="noopener noreferrer"/.test(html), 'enlaces externos usan noopener noreferrer');

if (failures > 0) {
  console.error(`\n${failures} contrato(s) DOM fallaron.`);
  process.exit(1);
}

console.log('\nDOM contract: OK');

function report(ok, label) {
  console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
  if (!ok) failures += 1;
}
