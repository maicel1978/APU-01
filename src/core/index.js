/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *API pública Core consumida por la UI.*
**/

export { checkBrowserSupport } from './support.js';
export { estimateProcessingMemory, MEMORY_LIMITS } from './memory.js';
export { validateAudioFile } from './file-validation.js';
export { createConversionController } from './conversion-controller.js';
export { OUTPUT_MODES, getProcessingProfiles, normalizeOutputMode } from './processing-profiles.js';
export { createManifestBlob, createPreparedManifest, manifestFileNameFromWav } from './manifest.js';
export { UserFacingError, normalizeError } from '../utils/errors.js';
