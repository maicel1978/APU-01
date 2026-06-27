/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Auditoría estática de reglas PRISMA+ críticas y archivos de publicación GitHub.*
**/

import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const ROOTS = ['src', 'docs', 'tests', 'assets/vendor/ffmpeg'];
const ROOT_FILES = ['index.html', 'README.md', 'CHANGELOG.md', 'package.json', '.gitignore'];
const MAX_LINES = 350;
const FRAMEWORK_RE = /\b(React|Vue|Svelte|Angular)\b/;
const JS_HEADER = '/**\n  *PRISMA+ v5.2';
const ACTIVE_PROTOCOL = '1.2.0';

let failures = 0;
const files = [];

for (const root of ROOTS) files.push(...(await walk(root)));
files.push(...ROOT_FILES);

for (const file of files) {
  if (!isAuditedText(file)) continue;
  const text = await readFile(file, 'utf8');
  const lines = text.split('\n').length;

  report(lines <= MAX_LINES, `${file} respeta R10 (${lines} líneas)`);
  if (file.endsWith('.js') || file.endsWith('.mjs')) report(text.startsWith(JS_HEADER), `${file} tiene cabecera PRISMA+ R14`);
  if (file.startsWith('src') || file === 'index.html') report(!FRAMEWORK_RE.test(text), `${file} no contiene frameworks runtime`);
}

const contracts = await readFile('docs/API-CONTRACTS.md', 'utf8');
const workerContracts = await readFile('docs/API-CONTRACTS-WORKER.md', 'utf8');
const controller = await readFile('src/core/conversion-controller.js', 'utf8');
const worker = await readFile('src/workers/audio-conversion.worker.js', 'utf8');
const readme = await readFile('README.md', 'utf8');

report(contracts.includes(`Protocol Version: ${ACTIVE_PROTOCOL}`), `API-CONTRACTS.md documenta protocolo ${ACTIVE_PROTOCOL}`);
report(workerContracts.includes(`protocolVersion: '${ACTIVE_PROTOCOL}'`), `API-CONTRACTS-WORKER.md documenta mensajes ${ACTIVE_PROTOCOL}`);
report(controller.includes(`const PROTOCOL_VERSION = '${ACTIVE_PROTOCOL}'`), `Core usa protocolo ${ACTIVE_PROTOCOL}`);
report(worker.includes(`const PROTOCOL_VERSION = '${ACTIVE_PROTOCOL}'`), `Worker usa protocolo ${ACTIVE_PROTOCOL}`);
report(controller.includes('MessageChannel'), 'Core usa MessageChannel');
report(worker.includes('INIT_PORT'), 'Worker acepta INIT_PORT');
report(readme.includes('python3 -m http.server 8080'), 'README incluye ejecución local');
report(readme.includes('npm test'), 'README incluye tests');
report(readme.includes('WAV para transcripción'), 'README documenta modo transcripción');
report(readme.includes('Protocol Version') || contracts.includes('Protocol Version: 1.2.0'), 'documentación incluye protocolo activo');

if (failures > 0) {
  console.error(`\n${failures} auditoría(s) fallaron.`);
  process.exit(1);
}

console.log('\nStatic audit: OK');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...(await walk(path)));
    else if ((await stat(path)).isFile()) results.push(path);
  }
  return results;
}

function isAuditedText(file) {
  return ['.js', '.mjs', '.css', '.html', '.md', '.json', '.gitignore'].some((extension) => file.endsWith(extension));
}

function report(ok, label) {
  console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
  if (!ok) failures += 1;
}
