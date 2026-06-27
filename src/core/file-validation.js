/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Validación defensiva de archivos de audio antes de enviarlos al Worker.*
**/

import { createUserError } from '../utils/errors.js';
import { sanitizeFileStem } from '../utils/format.js';
import { estimateProcessingMemory } from './memory.js';

const SUPPORTED_EXTENSIONS = new Set(['mp3', 'ogg', 'wav']);
const SUPPORTED_MIME_HINTS = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'application/ogg',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/vnd.wave',
]);

export function validateAudioFile(file) {
  if (!file) throw createUserError('ERR_NO_FILE', 'No se seleccionó ningún archivo.');

  const name = String(file.name || '').trim();
  const extension = getExtension(name);

  if (file.size <= 0) throw createUserError('ERR_EMPTY_FILE', 'El archivo está vacío.');

  if (extension === 'pm3') {
    throw createUserError('ERR_PM3_EXTENSION', 'No reconocemos .pm3.', {
      suggestion: 'Si querías usar MP3, revisa el nombre del archivo.',
    });
  }

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw createUserError('ERR_UNSUPPORTED_FORMAT', 'Este formato no está soportado.', {
      suggestion: 'Usa MP3, OGG o WAV.',
    });
  }

  if (file.type && !SUPPORTED_MIME_HINTS.has(file.type.toLowerCase())) {
    throw createUserError('ERR_UNSUPPORTED_FORMAT', 'Este archivo no parece ser un audio MP3, OGG o WAV válido.', {
      suggestion: 'Prueba con otro archivo de audio.',
    });
  }

  const memory = estimateProcessingMemory(file);
  if (!memory.safe) {
    throw createUserError('ERR_FILE_TOO_LARGE', 'Este archivo es demasiado grande para procesarlo de forma segura en este navegador.', {
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
