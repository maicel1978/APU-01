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

  const diagnostics = {
    isSecureContext: Boolean(globalThis.isSecureContext),
    crossOriginIsolated: Boolean(globalThis.crossOriginIsolated),
    sharedArrayBuffer: typeof globalThis.SharedArrayBuffer !== 'undefined',
  };
  const warnings = [];

  if (!diagnostics.crossOriginIsolated) {
    warnings.push('El contexto no está aislado; verifica COOP/COEP en despliegue para máxima compatibilidad.');
  }

  if (missing.length > 0) {
    return {
      supported: false,
      missing,
      warnings,
      diagnostics,
      message: 'Este navegador no tiene las capacidades necesarias para convertir audio de forma segura.',
    };
  }

  return {
    supported: true,
    missing: [],
    warnings,
    diagnostics,
    message: 'Navegador compatible para conversión local.',
  };
}
