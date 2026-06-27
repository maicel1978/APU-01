/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Detección defensiva de capacidades mínimas del navegador.*
**/

export function checkBrowserSupport() {
  const hasBlobUrls =
    typeof globalThis.URL !== 'undefined' && typeof globalThis.URL.createObjectURL === 'function';

  const checks = [
    ['File API', typeof globalThis.File !== 'undefined' && typeof globalThis.FileReader !== 'undefined'],
    ['Blob URLs', typeof globalThis.Blob !== 'undefined' && hasBlobUrls],
    ['Web Workers', typeof globalThis.Worker !== 'undefined'],
    ['MessageChannel', typeof globalThis.MessageChannel !== 'undefined'],
    ['WebAssembly', typeof globalThis.WebAssembly !== 'undefined'],
    ['ES Modules', true],
  ];

  const missing = checks.filter(([, supported]) => !supported).map(([name]) => name);

  if (missing.length > 0) {
    return {
      supported: false,
      missing,
      message: 'Este navegador no tiene las capacidades necesarias para convertir audio de forma segura.',
    };
  }

  return {
    supported: true,
    missing: [],
    message: 'Navegador compatible para conversión local.',
  };
}
