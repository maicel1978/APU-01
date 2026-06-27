/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Errores de usuario tipados y seguros para módulos Core/UI.*
**/

export class UserFacingError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = 'UserFacingError';
    this.code = code;
    this.suggestion = options.suggestion || '';
    this.recoverable = options.recoverable ?? true;
    this.details = options.details;
  }

  toUserMessage() {
    return this.suggestion ? `${this.message} ${this.suggestion}` : this.message;
  }
}

export function createUserError(code, message, options = {}) {
  return new UserFacingError(code, message, options);
}

export function normalizeError(error) {
  if (error instanceof UserFacingError) return error;

  return new UserFacingError(
    'ERR_UNKNOWN',
    'No pudimos completar la operación.',
    {
      suggestion: 'Intenta con otro archivo MP3 u OGG.',
      recoverable: true,
      details: error instanceof Error ? error.message : error,
    },
  );
}

export function mapWorkerError(message, details) {
  const normalized = String(message || '').toLowerCase();

  if (normalized.includes('memory') || normalized.includes('alloc')) {
    return createUserError(
      'ERR_WORKER_MEMORY',
      'Este archivo es demasiado grande para procesarlo de forma segura en este navegador.',
      { recoverable: true, details },
    );
  }

  if (normalized.includes('cancel')) {
    return createUserError('ERR_CANCELLED', 'Conversión cancelada.', {
      recoverable: true,
      details,
    });
  }

  return createUserError(
    'ERR_CONVERSION_FAILED',
    'No pudimos convertir este audio.',
    {
      suggestion: 'Prueba con otro archivo MP3 u OGG.',
      recoverable: true,
      details,
    },
  );
}
