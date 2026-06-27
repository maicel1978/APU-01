/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Perfiles de salida APU-01.1 para WAV estándar y preparación de transcripción.*
**/

export const OUTPUT_MODES = Object.freeze({
  standardWav: 'standard-wav',
  transcriptionPrep: 'transcription-prep',
});

const PROFILES = Object.freeze([
  Object.freeze({
    outputMode: OUTPUT_MODES.transcriptionPrep,
    label: 'WAV para transcripción',
    recommended: true,
    description: 'Recomendado para entrevistas, grupos focales y transcripción automática.',
    target: Object.freeze({
      container: 'wav',
      codec: 'pcm_s16le',
      channels: 1,
      sampleRate: 16000,
      bitDepth: 16,
    }),
  }),
  Object.freeze({
    outputMode: OUTPUT_MODES.standardWav,
    label: 'WAV estándar',
    recommended: false,
    description: 'Conversión simple a WAV para compatibilidad general.',
  }),
]);

export function getProcessingProfiles() {
  return PROFILES.map((profile) => ({
    ...profile,
    target: profile.target ? { ...profile.target } : undefined,
  }));
}

export function normalizeOutputMode(outputMode) {
  return Object.values(OUTPUT_MODES).includes(outputMode)
    ? outputMode
    : OUTPUT_MODES.transcriptionPrep;
}

export function getOutputSuffix(outputMode) {
  return normalizeOutputMode(outputMode) === OUTPUT_MODES.transcriptionPrep ? '_prepared.wav' : '.wav';
}
