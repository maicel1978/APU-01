/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Worker APU-01.1: conversión WAV estándar o preparación para transcripción.*
**/

import { FFmpeg } from '../../assets/vendor/ffmpeg/ffmpeg/index.js';

const PROTOCOL_VERSION = '1.2.0';
const ENGINE_NAME = 'ffmpeg.wasm';
const OUTPUT_MODES = Object.freeze({ standard: 'standard-wav', transcription: 'transcription-prep' });

let ffmpeg = null;
let engineReady = false;
let loadingPromise = null;
let currentTaskId = null;
let cancelRequested = false;
let lastProgressPost = 0;
let activeReportEvery = 1000;
let transport = self;

self.onmessage = (event) => {
  const message = event.data;
  if (message?.protocolVersion === PROTOCOL_VERSION && message.type === 'INIT_PORT' && event.ports?.[0]) {
    transport = event.ports[0];
    transport.onmessage = routeMessage;
    transport.start?.();
    return;
  }
  routeMessage(event);
};

async function routeMessage(event) {
  const message = event.data;
  if (!isValidMessage(message)) return;

  try {
    if (message.type === 'PING') post(message.id, 'PONG', { workerReady: true });
    if (message.type === 'LOAD_ENGINE') await loadEngine(message.id);
    if (message.type === 'CONVERT_AUDIO') await convertAudio(message);
    if (message.type === 'CANCEL') cancelConversion(message.id);
    if (message.type === 'DISPOSE') disposeEngine(message.id);
  } catch (error) {
    postError(message.id, error);
  }
}

async function convertAudio(message) {
  if (currentTaskId && currentTaskId !== message.id) throw new Error('Ya hay una conversión en curso.');

  currentTaskId = message.id;
  cancelRequested = false;
  lastProgressPost = 0;

  const { inputBuffer, inputExtension, outputFileName, outputMode, reportEvery } = message.payload || {};
  const safeOutputMode = normalizeOutputMode(outputMode);
  activeReportEvery = Number.isFinite(reportEvery) ? reportEvery : 1000;
  const inputName = `input-${message.id}.${inputExtension}`;
  const outputName = `output-${message.id}.wav`;

  validatePayload(inputBuffer, inputExtension, outputFileName, safeOutputMode);

  try {
    post(message.id, 'STATE', { state: 'loading-engine', message: 'Preparando el conversor…' });
    await loadEngine(message.id);
    throwIfCancelled();

    post(message.id, 'STATE', { state: 'reading-input', message: 'Leyendo audio…' });
    await ffmpeg.writeFile(inputName, new Uint8Array(inputBuffer));
    throwIfCancelled();

    post(message.id, 'STATE', { state: 'converting', message: getConvertingMessage(safeOutputMode) });
    await ffmpeg.exec(buildArgs(inputName, outputName, safeOutputMode));
    throwIfCancelled();

    post(message.id, 'STATE', { state: 'writing-output', message: 'Preparando descarga…' });
    const data = await ffmpeg.readFile(outputName);
    const outputBuffer = toTightArrayBuffer(data);

    post(
      message.id,
      'CONVERSION_COMPLETE',
      { outputBuffer, outputFileName, outputMimeType: 'audio/wav', outputMode: safeOutputMode },
      [outputBuffer],
    );
  } finally {
    await cleanupFiles(inputName, outputName);
    currentTaskId = null;
    cancelRequested = false;
  }
}

async function loadEngine(id) {
  if (engineReady) {
    post(id, 'ENGINE_READY', { engine: ENGINE_NAME, singleThread: true });
    return;
  }

  if (!loadingPromise) {
    ffmpeg = new FFmpeg();
    ffmpeg.on('progress', ({ progress }) => {
      const ratio = Number.isFinite(progress) ? clamp(progress, 0, 1) : null;
      postThrottledProgress(currentTaskId, activeReportEvery, ratio, 'Procesando audio…');
    });
    ffmpeg.on('log', ({ message }) => {
      if (message && currentTaskId) post(currentTaskId, 'STATE', { state: 'converting', message: 'Procesando audio…' });
    });

    loadingPromise = ffmpeg.load({
      coreURL: assetUrl('../../assets/vendor/ffmpeg/core/ffmpeg-core.js'),
      wasmURL: assetUrl('../../assets/vendor/ffmpeg/core/ffmpeg-core.wasm'),
    });
  }

  await loadingPromise;
  engineReady = true;
  post(id, 'ENGINE_READY', { engine: ENGINE_NAME, singleThread: true });
}

function buildArgs(inputName, outputName, outputMode) {
  if (outputMode === OUTPUT_MODES.transcription) {
    return [
      '-i', inputName,
      '-vn',
      '-ac', '1',
      '-ar', '16000',
      '-af', 'highpass=f=80,dynaudnorm,acompressor',
      '-acodec', 'pcm_s16le',
      outputName,
    ];
  }
  return ['-i', inputName, '-vn', '-acodec', 'pcm_s16le', outputName];
}

function cancelConversion(id) {
  if (!currentTaskId || id !== currentTaskId) return;
  cancelRequested = true;
  post(id, 'STATE', { state: 'cleanup', message: 'Cancelando conversión…' });

  if (ffmpeg) {
    ffmpeg.terminate();
    ffmpeg = null;
    engineReady = false;
    loadingPromise = null;
  }

  post(id, 'CANCELLED', { message: 'Conversión cancelada.' });
  currentTaskId = null;
}

function disposeEngine(id) {
  if (ffmpeg) ffmpeg.terminate();
  ffmpeg = null;
  engineReady = false;
  loadingPromise = null;
  currentTaskId = null;
  cancelRequested = false;
  post(id, 'DISPOSED', { message: 'Recursos liberados.' });
}

async function cleanupFiles(inputName, outputName) {
  if (!ffmpeg || !engineReady) return;
  for (const name of [inputName, outputName]) {
    try {
      await ffmpeg.deleteFile(name);
    } catch {
      /* Limpieza defensiva: ignorar si el archivo no existe. */
    }
  }
}

function validatePayload(inputBuffer, inputExtension, outputFileName, outputMode) {
  if (!(inputBuffer instanceof ArrayBuffer) || inputBuffer.byteLength === 0) throw new Error('Archivo de entrada inválido.');
  if (!['mp3', 'ogg', 'wav'].includes(inputExtension)) throw new Error('Formato no soportado.');
  if (!String(outputFileName || '').toLowerCase().endsWith('.wav')) throw new Error('Nombre de salida inválido.');
  if (!Object.values(OUTPUT_MODES).includes(outputMode)) throw new Error('Modo de salida inválido.');
}

function normalizeOutputMode(outputMode) {
  return Object.values(OUTPUT_MODES).includes(outputMode) ? outputMode : OUTPUT_MODES.transcription;
}

function getConvertingMessage(outputMode) {
  return outputMode === OUTPUT_MODES.transcription ? 'Preparando audio para transcripción…' : 'Convirtiendo audio…';
}

function throwIfCancelled() {
  if (cancelRequested) throw new Error('cancelled');
}

function postProgress(id, ratio, message) {
  if (!id) return;
  const percent = ratio === null ? null : Math.round(ratio * 100);
  post(id, 'PROGRESS', { ratio, percent, message });
}

function postThrottledProgress(id, reportEvery = 1000, ratio, message) {
  if (!id) return;
  const now = Date.now();
  if (now - lastProgressPost >= reportEvery) {
    lastProgressPost = now;
    postProgress(id, ratio, message);
  }
}

function post(id, type, payload, transfer = []) {
  transport.postMessage({ protocolVersion: PROTOCOL_VERSION, type, id, payload }, transfer);
}

function postError(id, error) {
  if (String(error?.message || error).toLowerCase().includes('cancel')) {
    post(id, 'CANCELLED', { message: 'Conversión cancelada.' });
    return;
  }
  transport.postMessage({
    protocolVersion: PROTOCOL_VERSION,
    type: 'ERROR',
    id,
    message: error?.message || 'Error de conversión.',
    details: error?.stack || String(error),
  });
}

function isValidMessage(message) {
  return message && message.protocolVersion === PROTOCOL_VERSION && typeof message.id === 'string';
}

function assetUrl(relativePath) {
  return new URL(relativePath, import.meta.url).href;
}

function toTightArrayBuffer(data) {
  const view = data instanceof Uint8Array ? data : new Uint8Array(data);
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
