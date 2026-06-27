/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Generación de manifest APU-01.1 para audio preparado de transcripción.*
**/

import { OUTPUT_MODES, normalizeOutputMode } from './processing-profiles.js';

export function createPreparedManifest({ fileDescriptor, outputFileName, outputSizeBytes = null }) {
  if (!fileDescriptor) throw new TypeError('fileDescriptor es obligatorio para crear manifest.');

  return {
    schemaVersion: '1.0.0',
    ecosystem: 'APU',
    unit: 'APU-01',
    stage: 'prepared-audio',
    createdAt: new Date().toISOString(),
    source: {
      fileName: fileDescriptor.name,
      format: fileDescriptor.extension,
      sizeBytes: fileDescriptor.sizeBytes,
    },
    output: {
      fileName: outputFileName,
      format: 'wav',
      codec: 'pcm_s16le',
      channels: 1,
      sampleRate: 16000,
      bitDepth: 16,
      sizeBytes: outputSizeBytes,
    },
    processing: {
      mode: OUTPUT_MODES.transcriptionPrep,
      highPassFilter: true,
      dynamicNormalization: true,
      lightCompression: true,
      silenceHandling: 'preserve-significant-pauses',
    },
    privacy: {
      processedLocally: true,
      networkUpload: false,
    },
  };
}

export function manifestFileNameFromWav(outputFileName) {
  return String(outputFileName || 'audio_prepared.wav').replace(/\.wav$/i, '_manifest.json');
}

export function createManifestBlob(manifest) {
  const json = JSON.stringify(manifest, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export function shouldCreateManifest(outputMode) {
  return normalizeOutputMode(outputMode) === OUTPUT_MODES.transcriptionPrep;
}
