/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Orquestador Core APU-01.1 para conversión en Worker con protocolo 1.2.0.*
**/

import { createUserError, mapWorkerError, normalizeError } from '../utils/errors.js';
import { createPreparedManifest, shouldCreateManifest } from './manifest.js';
import { OUTPUT_MODES, normalizeOutputMode } from './processing-profiles.js';

const PROTOCOL_VERSION = '1.2.0';
const DEFAULT_REPORT_EVERY = 1000;

export function createConversionController({ workerUrl, reportEvery = DEFAULT_REPORT_EVERY } = {}) {
  let worker = null;
  let port = null;
  let activeId = null;
  let activeReject = null;

  function ensurePort() {
    if (!workerUrl) throw createUserError('ERR_WORKER_NOT_CONFIGURED', 'El conversor todavía no está configurado.');
    if (typeof globalThis.Worker !== 'function' || typeof globalThis.MessageChannel !== 'function') {
      throw createUserError('ERR_WORKER_UNAVAILABLE', 'Este navegador no permite procesar audio de forma segura.');
    }

    if (!worker || !port) {
      worker = new globalThis.Worker(workerUrl, { type: 'module' });
      const channel = new globalThis.MessageChannel();
      port = channel.port1;
      port.start?.();
      worker.postMessage(
        { protocolVersion: PROTOCOL_VERSION, type: 'INIT_PORT', id: 'transport', payload: {} },
        [channel.port2],
      );
    }
    return port;
  }

  async function convert(fileDescriptor, conversionOptionsOrCallbacks = {}, maybeCallbacks = {}) {
    if (activeId) throw createUserError('ERR_CONVERSION_ACTIVE', 'Ya hay una conversión en curso.');

    const { conversionOptions, callbacks } = normalizeConvertArgs(conversionOptionsOrCallbacks, maybeCallbacks);
    const outputMode = normalizeOutputMode(conversionOptions.outputMode);
    const outputFileName = resolveOutputFileName(fileDescriptor.outputFileName, outputMode);

    activeId = fileDescriptor.id;
    callbacks.onStateChange?.({ state: 'reading-input', message: 'Preparando archivo…' });

    try {
      const inputBuffer = await fileDescriptor.file.arrayBuffer();
      return await postConversion(fileDescriptor, inputBuffer, outputMode, outputFileName, callbacks);
    } catch (error) {
      const normalized = normalizeError(error);
      callbacks.onError?.(normalized);
      throw normalized;
    } finally {
      activeId = null;
      activeReject = null;
    }
  }

  function cancel(id) {
    if (!port || !activeId || id !== activeId) return;
    port.postMessage({ protocolVersion: PROTOCOL_VERSION, type: 'CANCEL', id, payload: { reason: 'user_requested' } });
  }

  function dispose() {
    if (port) port.postMessage({ protocolVersion: PROTOCOL_VERSION, type: 'DISPOSE', id: activeId || 'dispose' });
    if (worker) worker.terminate();
    worker = null;
    port = null;
    activeId = null;
    activeReject?.(createUserError('ERR_CANCELLED', 'Conversión cancelada.'));
    activeReject = null;
  }

  function postConversion(fileDescriptor, inputBuffer, outputMode, outputFileName, callbacks) {
    const messagePort = ensurePort();

    return new Promise((resolve, reject) => {
      activeReject = reject;
      messagePort.onmessage = (event) => {
        handleWorkerMessage(event.data, fileDescriptor, outputMode, callbacks, resolve, reject);
      };
      worker.onerror = (event) => reject(mapWorkerError(event.message, event));

      callbacks.onStateChange?.({ state: 'engine-loading', message: 'Preparando el conversor…' });
      messagePort.postMessage(
        {
          protocolVersion: PROTOCOL_VERSION,
          type: 'CONVERT_AUDIO',
          id: fileDescriptor.id,
          payload: {
            fileName: fileDescriptor.name,
            inputBuffer,
            inputExtension: fileDescriptor.extension,
            outputFileName,
            outputMode,
            reportEvery,
          },
        },
        [inputBuffer],
      );
    });
  }

  return { convert, cancel, dispose };
}

function normalizeConvertArgs(conversionOptionsOrCallbacks, maybeCallbacks) {
  const looksLikeCallbacks = ['onStateChange', 'onProgress', 'onError'].some((key) => key in conversionOptionsOrCallbacks);
  if (looksLikeCallbacks) return { conversionOptions: {}, callbacks: conversionOptionsOrCallbacks };
  return { conversionOptions: conversionOptionsOrCallbacks || {}, callbacks: maybeCallbacks || {} };
}

function handleWorkerMessage(message, fileDescriptor, outputMode, callbacks, resolve, reject) {
  if (!message || message.protocolVersion !== PROTOCOL_VERSION || message.id !== fileDescriptor.id) return;

  if (message.type === 'STATE') callbacks.onStateChange?.(message.payload);
  if (message.type === 'ENGINE_READY') callbacks.onStateChange?.({ state: 'engine-ready', message: 'Conversor preparado.' });
  if (message.type === 'PROGRESS') callbacks.onProgress?.(message.payload);
  if (message.type === 'CANCELLED') reject(createUserError('ERR_CANCELLED', 'Conversión cancelada.'));
  if (message.type === 'ERROR') reject(mapWorkerError(message.message, message.details));

  if (message.type === 'CONVERSION_COMPLETE') {
    const blob = new Blob([message.payload.outputBuffer], { type: 'audio/wav' });
    const resultMode = normalizeOutputMode(message.payload.outputMode || outputMode);
    const outputFileName = message.payload.outputFileName;
    resolve({
      id: fileDescriptor.id,
      outputMode: resultMode,
      outputBlob: blob,
      outputFileName,
      outputMimeType: 'audio/wav',
      outputSizeBytes: blob.size,
      manifest: shouldCreateManifest(resultMode)
        ? createPreparedManifest({ fileDescriptor, outputFileName, outputSizeBytes: blob.size })
        : null,
    });
  }
}

function resolveOutputFileName(baseOutputFileName, outputMode) {
  if (outputMode !== OUTPUT_MODES.transcriptionPrep) return baseOutputFileName;
  return String(baseOutputFileName || 'audio.wav').replace(/\.wav$/i, '_prepared.wav');
}
