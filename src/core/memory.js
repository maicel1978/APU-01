/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Estimación defensiva de memoria antes de procesar audio.*
**/

const MB = 1024 * 1024;
const MIN_PROCESSING_BUDGET = 256 * MB;
const FALLBACK_SAFE_FILE_LIMIT = 50 * MB;
const INPUT_MULTIPLIER = 12;
const HEAP_USAGE_LIMIT = 0.6;

export function estimateProcessingMemory(file) {
  const size = Number(file?.size || 0);
  const estimatedBytes = Math.max(size * INPUT_MULTIPLIER, MIN_PROCESSING_BUDGET);
  const heapLimit = globalThis.performance?.memory?.jsHeapSizeLimit || null;

  if (heapLimit) {
    const limitBytes = Math.floor(heapLimit * HEAP_USAGE_LIMIT);
    return {
      estimatedBytes,
      limitBytes,
      safe: estimatedBytes <= limitBytes,
      reason: estimatedBytes <= limitBytes ? '' : 'heap-limit',
    };
  }

  return {
    estimatedBytes,
    limitBytes: FALLBACK_SAFE_FILE_LIMIT,
    safe: size <= FALLBACK_SAFE_FILE_LIMIT,
    reason: size <= FALLBACK_SAFE_FILE_LIMIT ? '' : 'fallback-file-limit',
  };
}

export const MEMORY_LIMITS = Object.freeze({
  fallbackSafeFileLimitBytes: FALLBACK_SAFE_FILE_LIMIT,
  inputMultiplier: INPUT_MULTIPLIER,
  minProcessingBudgetBytes: MIN_PROCESSING_BUDGET,
  heapUsageLimit: HEAP_USAGE_LIMIT,
});
