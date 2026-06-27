/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Smoke tests Node para contratos Core APU-01/APU-01.1 sin procesar audio pesado.*
**/

import {
  OUTPUT_MODES,
  checkBrowserSupport,
  createManifestBlob,
  createPreparedManifest,
  estimateProcessingMemory,
  getProcessingProfiles,
  manifestFileNameFromWav,
  validateAudioFile,
} from '../src/core/index.js';

const MB = 1024 * 1024;
const cases = [
  { file: fileLike('voz-clinica.mp3', 1 * MB, 'audio/mpeg'), expect: 'ok' },
  { file: fileLike('registro-investigacion.ogg', 2 * MB, 'audio/ogg'), expect: 'ok' },
  { file: fileLike('entrevista.wav', 2 * MB, 'audio/wav'), expect: 'ok' },
  { file: fileLike('error-tipografico.pm3', 1 * MB, ''), expect: 'ERR_PM3_EXTENSION' },
  { file: fileLike('documento.txt', 1 * MB, 'text/plain'), expect: 'ERR_UNSUPPORTED_FORMAT' },
  { file: fileLike('vacio.mp3', 0, 'audio/mpeg'), expect: 'ERR_EMPTY_FILE' },
  { file: fileLike('grande.mp3', 60 * MB, 'audio/mpeg'), expect: 'ERR_FILE_TOO_LARGE' },
];

let failures = 0;
let wavDescriptor = null;

for (const testCase of cases) {
  const result = runValidationCase(testCase.file, testCase.expect);
  if (testCase.file.name.endsWith('.wav') && result.descriptor) wavDescriptor = result.descriptor;
  report(result.ok, result.label);
}

const memory = estimateProcessingMemory(fileLike('voz.mp3', 1 * MB, 'audio/mpeg'));
report(Number.isFinite(memory.estimatedBytes), 'estimateProcessingMemory devuelve estimatedBytes numérico');
report(typeof memory.safe === 'boolean', 'estimateProcessingMemory devuelve safe booleano');

const support = checkBrowserSupport();
report(typeof support.supported === 'boolean', 'checkBrowserSupport devuelve supported booleano');
report(Array.isArray(support.missing), 'checkBrowserSupport devuelve missing como array');

const profiles = getProcessingProfiles();
report(profiles.some((profile) => profile.outputMode === OUTPUT_MODES.transcriptionPrep), 'perfiles incluyen transcription-prep');
report(profiles.some((profile) => profile.outputMode === OUTPUT_MODES.standardWav), 'perfiles incluyen standard-wav');

const manifest = createPreparedManifest({ fileDescriptor: wavDescriptor, outputFileName: 'entrevista_prepared.wav', outputSizeBytes: 1234 });
report(manifest.output.sampleRate === 16000, 'manifest declara 16 kHz');
report(manifest.output.channels === 1, 'manifest declara mono');
report(manifest.privacy.networkUpload === false, 'manifest declara sin subida a red');
report(manifestFileNameFromWav('entrevista_prepared.wav') === 'entrevista_prepared_manifest.json', 'nombre manifest correcto');
report(createManifestBlob(manifest).type === 'application/json', 'manifest blob JSON correcto');

if (failures > 0) {
  console.error(`\n${failures} prueba(s) fallaron.`);
  process.exit(1);
}

console.log('\nCore smoke tests: OK');

function runValidationCase(file, expect) {
  try {
    const descriptor = validateAudioFile(file);
    return {
      ok: expect === 'ok' && descriptor.status === 'ready' && descriptor.outputFileName.endsWith('.wav'),
      label: `${file.name} → ${expect}`,
      descriptor,
    };
  } catch (error) {
    return { ok: error.code === expect, label: `${file.name} → ${expect}`, descriptor: null };
  }
}

function report(ok, label) {
  console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
  if (!ok) failures += 1;
}

function fileLike(name, size, type) {
  return {
    name,
    size,
    type,
    async arrayBuffer() {
      return new ArrayBuffer(size);
    },
  };
}
