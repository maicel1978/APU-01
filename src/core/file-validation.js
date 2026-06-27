/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Validación defensiva de archivos de audio antes de enviarlos al Worker.*
**/

import { createUserError } from '../utils/errors.js';
import { sanitizeFileStem } from '../utils/format.js';
import { estimateProcessingMemory } from './memory.js';

const SUPPORTED_EXTENSIONS = new Set(['mp3', 'ogg', 'oga', 'opus', 'wav', 'm4a', 'aac', 'mp4', 'webm', 'flac']);
const SUPPORTED_MIME_HINTS = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'application/ogg',
  'audio/opus',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/vnd.wave',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/aacp',
  'audio/webm',
  'audio/flac',
  'video/mp4',
  'video/webm',
]);

export function validateAudioFile(file) {
  if (!file) throw createUserError('ERR_NO_FILE', 'No se seleccionó ningún archivo.');

  const name = String(file.name || '').trim();
  const extension = getExtension(name);
  const warnings = [];

  if (file.size <= 0) throw createUserError('ERR_EMPTY_FILE', 'El archivo está vacío.');

  if (extension === 'pm3') {
    throw createUserError('ERR_PM3_EXTENSION', 'No reconocemos .pm3.', {
      suggestion: 'Si querías usar MP3, revisa el nombre del archivo.',
    });
  }

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw createUserError('ERR_UNSUPPORTED_FORMAT', 'Este formato no está soportado.', {
      suggestion: 'Usa MP3, WAV, OGG/OPUS, M4A/AAC, MP4, WEBM o FLAC.',
    });
  }

  if (file.type && !SUPPORTED_MIME_HINTS.has(file.type.toLowerCase())) {
    warnings.push('El tipo informado por el navegador no coincide con la extensión; se intentará convertir de todos modos.');
  }

  if (!file.type) warnings.push('El navegador no informó el tipo de archivo; se validó por extensión.');

  const memory = estimateProcessingMemory(file);
  if (!memory.safe) {
    throw createUserError('ERR_FILE_TOO_LARGE', 'Este archivo es demasiado grande para procesarlo de forma segura en este navegador.', {
      suggestion: 'Divide la grabación en segmentos más pequeños o usa un equipo con más memoria.',
      recoverable: true,
      details: memory,
    });
  }

  return {
    id: createSafeId(),
    file,
    name,
    extension,
    mimeType: file.type || '',
    sizeBytes: file.size,
    warnings,
    outputFileName: `${sanitizeFileStem(name)}.wav`,
    status: 'ready',
  };
}

function getExtension(name) {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : '';
}

function createSafeId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `audio-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
