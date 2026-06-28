/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Servidor local Node.js con headers COOP/COEP para desarrollo APU.*
**/

import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number.parseInt(process.argv[2] || '8080', 10);

const MIME_TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
});

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveRequestPath(request.url || '/');
    await sendFile(request, response, filePath, filePath.endsWith('404.html') ? 404 : 200);
  } catch (error) {
    await sendFallback404(request, response, error);
  }
});

server.listen(PORT, () => {
  console.log('\n========================================================');
  console.log('   APU-01 — Servidor local Node con headers COOP/COEP');
  console.log('   Ecosistema APU (Privacy-First)');
  console.log('========================================================');
  console.log(`\n🚀 Servidor iniciado en: http://localhost:${PORT}`);
  console.log('   Headers COOP + COEP activos (SharedArrayBuffer compatible)');
  console.log('   Presiona Ctrl+C para detener\n');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] El puerto ${PORT} ya está en uso. Prueba: npm start -- 8081`);
    process.exit(1);
  }
  console.error(`\n[ERROR] ${error.message}`);
  process.exit(1);
});

async function resolveRequestPath(url) {
  const { pathname } = new URL(url, `http://localhost:${PORT}`);
  const decodedPath = decodeURIComponent(pathname);
  const normalizedPath = normalize(decodedPath).replace(/^[/\\]+/, '');
  const candidate = join(ROOT, normalizedPath || 'index.html');

  if (relative(ROOT, candidate).startsWith('..')) throw new Error('Ruta no permitida.');

  const info = await stat(candidate).catch(() => null);
  if (info?.isDirectory()) return join(candidate, 'index.html');
  if (info?.isFile()) return candidate;

  throw new Error('Archivo no encontrado.');
}

async function sendFile(request, response, filePath, statusCode) {
  await access(filePath);
  const extension = extname(filePath).toLowerCase();
  response.writeHead(statusCode, headersFor(extension));

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

async function sendFallback404(request, response) {
  const notFoundPath = join(ROOT, '404.html');
  try {
    await sendFile(request, response, notFoundPath, 404);
  } catch {
    response.writeHead(404, headersFor('.txt'));
    if (request.method === 'HEAD') response.end();
    else response.end('404 — Página no encontrada');
  }
}

function headersFor(extension) {
  return {
    'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': cacheControlFor(extension),
  };
}

function cacheControlFor(extension) {
  if (extension === '.wasm') return 'public, max-age=31536000, immutable';
  if (['.html', '.json', '.js', '.mjs', '.css'].includes(extension)) return 'no-store, must-revalidate';
  return 'public, max-age=3600';
}
