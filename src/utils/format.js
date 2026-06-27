/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Funciones de formato legibles para usuarios no técnicos.*
**/

export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Tamaño no disponible';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function sanitizeFileStem(name) {
  const withoutExtension = String(name || 'audio').replace(/\.[^.]+$/, '');
  return withoutExtension
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'audio';
}
