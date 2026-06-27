/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *UI APU-01.1 con selector de modo; conversión real delegada a Core/Worker.*
**/
import {
  checkBrowserSupport,
  createConversionController,
  createManifestBlob,
  manifestFileNameFromWav,
  validateAudioFile,
} from '../core/index.js';
import { normalizeError } from '../utils/errors.js';
import { formatSize } from '../utils/format.js';

const OUTPUT_MODES = Object.freeze({
  transcription: 'transcription-prep',
  standard: 'standard-wav',
});
const ui = {
  fileInput: document.querySelector('#audio-file'),
  dropzone: document.querySelector('.dropzone'),
  modeOptions: document.querySelectorAll('input[name="output-mode"]'),
  modeHelp: document.querySelector('[data-mode-help]'),
  modeSummary: document.querySelector('[data-mode-summary]'),
  statusSummary: document.querySelector('#status-summary'),
  fileCard: document.querySelector('[data-file-card]'),
  fileName: document.querySelector('[data-file-name]'),
  fileMeta: document.querySelector('[data-file-meta]'),
  statusBadge: document.querySelector('[data-status-badge]'),
  workerDot: document.querySelector('[data-worker-dot]'),
  workerText: document.querySelector('[data-worker-text]'),
  progressText: document.querySelector('[data-progress-text]'),
  progressPercent: document.querySelector('[data-progress-percent]'),
  progressBar: document.querySelector('[data-progress-bar]'),
  convertButton: document.querySelector('[data-convert]'),
  cancelButton: document.querySelector('[data-cancel]'),
  resetButton: document.querySelector('[data-reset]'),
  resultText: document.querySelector('[data-result-text]'),
  download: document.querySelector('[data-download]'),
  manifestDownload: document.querySelector('[data-manifest-download]'),
  audioPreviewWrap: document.querySelector('[data-audio-preview-wrap]'),
  audioPreview: document.querySelector('[data-audio-preview]'),
  previewNote: document.querySelector('[data-preview-note]'),
  outputPreviewWrap: document.querySelector('[data-output-preview-wrap]'),
  outputPreview: document.querySelector('[data-output-preview]'),
  message: document.querySelector('[data-message]'),
  error: document.querySelector('[data-error]'),
};
const controller = createConversionController({
  workerUrl: new URL('../workers/audio-conversion.worker.js', import.meta.url),
  reportEvery: 1000,
});
const state = {
  descriptor: null,
  view: 'idle',
  supported: false,
  outputMode: OUTPUT_MODES.transcription,
  downloadUrl: '',
  manifestUrl: '',
  previewUrl: '',
};
function setMessage(text, isError = false) {
  ui.message.textContent = isError ? '' : text;
  ui.error.textContent = isError ? text : '';
  ui.error.classList.toggle('is-hidden', !isError);
}
function setProgress(percent, label = 'Progreso') {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
  ui.progressText.textContent = label;
  ui.progressPercent.textContent = `${safePercent}%`;
  ui.progressBar.value = safePercent;
  ui.progressBar.textContent = `${safePercent}%`;
}
function setWorkerStatus(text, active = false) {
  ui.workerText.textContent = text;
  ui.workerDot.classList.toggle('is-active', active);
}
function setBadge(text, className = '') {
  ui.statusBadge.textContent = text;
  ui.statusBadge.className = `status-badge ${className}`.trim();
}
function revokeUrls() {
  if (state.downloadUrl) URL.revokeObjectURL(state.downloadUrl);
  if (state.manifestUrl) URL.revokeObjectURL(state.manifestUrl);
  state.downloadUrl = '';
  state.manifestUrl = '';
}
function revokePreviewUrl() {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
  state.previewUrl = '';
}
function setupInputPreview(file) {
  revokePreviewUrl();
  state.previewUrl = URL.createObjectURL(file);
  ui.audioPreview.src = state.previewUrl;
  ui.audioPreviewWrap.classList.remove('is-hidden');
  ui.previewNote.textContent = 'Vista previa local: el archivo no se sube a internet.';
}
function hideInputPreview() {
  revokePreviewUrl();
  ui.audioPreview.removeAttribute('src');
  ui.audioPreviewWrap.classList.add('is-hidden');
}
function hideOutputPreview() {
  ui.outputPreview.removeAttribute('src');
  ui.outputPreviewWrap.classList.add('is-hidden');
}
function getModeLabel(mode = state.outputMode) {
  return mode === OUTPUT_MODES.transcription ? 'preparación recomendada' : 'WAV estándar';
}
function getActionLabel() {
  return state.outputMode === OUTPUT_MODES.transcription ? 'Preparar audio' : 'Convertir a WAV';
}
function getPlannedOutputName(descriptor) {
  if (!descriptor) return '';
  if (state.outputMode === OUTPUT_MODES.standard) return descriptor.outputFileName;
  return descriptor.outputFileName.replace(/\.wav$/i, '_prepared.wav');
}
function updateModeUi() {
  ui.convertButton.textContent = getActionLabel();
  ui.modeSummary.textContent = `Modo seleccionado: ${getModeLabel()}.`;
  ui.modeHelp.textContent = state.outputMode === OUTPUT_MODES.transcription
    ? 'Conserva siempre el audio original. La app generará una copia preparada para transcripción.'
    : 'El modo estándar mantiene una conversión simple a WAV para compatibilidad general.';
  if (state.descriptor) updateFileMeta();
}
function updateFileMeta() {
  ui.fileMeta.textContent = `${formatSize(state.descriptor.sizeBytes)} · Salida prevista: ${getPlannedOutputName(state.descriptor)}`;
}
function renderIdle() {
  state.view = 'idle';
  state.descriptor = null;
  revokeUrls();
  hideInputPreview();
  hideOutputPreview();
  ui.statusSummary.textContent = 'Todavía no seleccionaste ningún archivo.';
  ui.fileCard.classList.add('is-empty');
  ui.fileName.textContent = 'Sin archivo seleccionado';
  ui.fileMeta.textContent = 'Cuando elijas un audio, aparecerá aquí.';
  setBadge('En espera');
  ui.convertButton.disabled = true;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = true;
  ui.download.classList.add('is-hidden');
  ui.download.removeAttribute('href');
  ui.manifestDownload.classList.add('is-hidden');
  ui.manifestDownload.removeAttribute('href');
  ui.resultText.textContent = 'El audio preparado aparecerá aquí cuando el procesamiento termine.';
  setWorkerStatus('Worker en espera', false);
  setProgress(0);
  updateModeUi();
  setMessage('Selecciona un audio común de celular, WhatsApp o computadora para comenzar.');
}
function renderUnsupported(result) {
  state.view = 'unsupported-browser';
  state.supported = false;
  ui.convertButton.disabled = true;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = true;
  setWorkerStatus('Worker no disponible', false);
  setMessage(`${result.message} Falta: ${result.missing.join(', ')}.`, true);
}
function renderFileReady(descriptor) {
  state.view = 'file-ready';
  state.descriptor = descriptor;
  revokeUrls();
  ui.statusSummary.textContent = 'Archivo revisado. Está listo para procesar.';
  ui.fileCard.classList.remove('is-empty');
  ui.fileName.textContent = descriptor.name;
  updateFileMeta();
  setupInputPreview(descriptor.file);
  setBadge('Listo', 'is-ready');
  ui.convertButton.disabled = false;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = false;
  ui.download.classList.add('is-hidden');
  ui.manifestDownload.classList.add('is-hidden');
  ui.resultText.textContent = 'El audio preparado aparecerá aquí cuando el procesamiento termine.';
  setWorkerStatus('Worker en espera', false);
  setProgress(0);
  updateModeUi();
  const warningText = descriptor.warnings?.length ? ` Advertencia: ${descriptor.warnings.join(' ')}` : '';
  setMessage(`Archivo válido. Modo seleccionado: ${getModeLabel()}.${warningText}`);
}
function renderProcessing(stateInfo) {
  state.view = stateInfo.state === 'loading-engine' ? 'engine-loading' : 'converting';
  ui.statusSummary.textContent = stateInfo.message || 'Procesando audio…';
  setBadge('Procesando', 'is-ready');
  ui.convertButton.disabled = true;
  ui.cancelButton.disabled = false;
  ui.resetButton.disabled = true;
  setWorkerStatus('Worker activo', true);
  setMessage(stateInfo.message || 'Procesando audio…');
}
function renderProgress(progress) {
  const percent = Number.isFinite(progress?.percent) ? progress.percent : ui.progressBar.value;
  const label = progress?.message || 'Procesando';
  setProgress(percent, label);
}
function renderCompleted(result) {
  state.view = 'completed';
  revokeUrls();
  state.downloadUrl = URL.createObjectURL(result.outputBlob);
  ui.statusSummary.textContent = result.manifest ? 'Audio preparado correctamente.' : 'Archivo WAV listo.';
  setBadge('Completado', 'is-done');
  ui.convertButton.disabled = true;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = false;
  ui.download.href = state.downloadUrl;
  ui.download.download = result.outputFileName;
  ui.download.textContent = result.manifest ? 'Descargar audio preparado' : 'Descargar WAV';
  ui.download.classList.remove('is-hidden');
  setupManifestDownload(result);
  if (result.manifest) {
    ui.resultText.textContent = `${result.outputFileName} · ${formatSize(result.outputSizeBytes)} · Listo para transcripción`;
  } else {
    ui.resultText.textContent = `${result.outputFileName} · ${formatSize(result.outputSizeBytes)}`;
  }
  ui.outputPreview.src = state.downloadUrl;
  ui.outputPreviewWrap.classList.remove('is-hidden');
  setWorkerStatus('Worker en espera', false);
  setProgress(100, 'Completado');
  setMessage(result.manifest ? 'Audio preparado. Descarga el WAV y el manifest para continuar el flujo APU.' : 'Archivo WAV listo para descargar.');
}
function setupManifestDownload(result) {
  ui.manifestDownload.classList.add('is-hidden');
  ui.manifestDownload.removeAttribute('href');
  if (!result.manifest) return;
  state.manifestUrl = URL.createObjectURL(createManifestBlob(result.manifest));
  ui.manifestDownload.href = state.manifestUrl;
  ui.manifestDownload.download = manifestFileNameFromWav(result.outputFileName);
  ui.manifestDownload.classList.remove('is-hidden');
}
function renderCancelled() {
  state.view = 'cancelled';
  ui.statusSummary.textContent = 'Conversión cancelada.';
  setBadge('Cancelado');
  ui.convertButton.disabled = !state.descriptor;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = false;
  setWorkerStatus('Worker en espera', false);
  setProgress(0);
  setMessage('Conversión cancelada. Puedes intentarlo de nuevo o cambiar el archivo.');
}
function renderError(error) {
  const normalized = normalizeError(error);
  const userMessage = normalized.toUserMessage();
  state.view = 'error';
  ui.statusSummary.textContent = userMessage;
  if (!state.descriptor) {
    ui.fileCard.classList.add('is-empty');
    ui.fileName.textContent = 'Archivo no aceptado';
    ui.fileMeta.textContent = normalized.suggestion || 'Selecciona otro archivo.';
  }
  setBadge('Error', 'is-error');
  ui.convertButton.disabled = true;
  ui.cancelButton.disabled = true;
  ui.resetButton.disabled = false;
  setWorkerStatus('Worker en espera', false);
  setMessage(userMessage, true);
}
function handleFiles(files) {
  const [file] = Array.from(files || []);
  if (!file || !state.supported) return;
  try {
    ui.statusSummary.textContent = 'Revisando el archivo…';
    setMessage('Revisando formato y tamaño antes de procesar.');
    renderFileReady(validateAudioFile(file));
  } catch (error) {
    state.descriptor = null;
    renderError(error);
  }
}
async function startConversion() {
  if (!state.descriptor) return;
  try {
    renderProcessing({ state: 'loading-engine', message: 'Preparando el conversor…' });
    const result = await controller.convert(
      state.descriptor,
      { outputMode: state.outputMode },
      {
        onStateChange: renderProcessing,
        onProgress: renderProgress,
        onError: renderError,
      },
    );
    renderCompleted(result);
  } catch (error) {
    if (error?.code === 'ERR_CANCELLED') renderCancelled();
    else renderError(error);
  }
}
function cancelConversion() {
  if (!state.descriptor) return;
  state.view = 'cancelling';
  ui.cancelButton.disabled = true;
  setMessage('Cancelando conversión…');
  controller.cancel(state.descriptor.id);
}
function bindDragAndDrop() {
  ['dragenter', 'dragover'].forEach((eventName) => {
    ui.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      ui.dropzone.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    ui.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      ui.dropzone.classList.remove('is-dragover');
    });
  });
  ui.dropzone.addEventListener('drop', (event) => handleFiles(event.dataTransfer?.files));
}
function bindControls() {
  ui.fileInput.addEventListener('change', (event) => handleFiles(event.target.files));
  ui.convertButton.addEventListener('click', startConversion);
  ui.cancelButton.addEventListener('click', cancelConversion);
  ui.resetButton.addEventListener('click', () => {
    ui.fileInput.value = '';
    renderIdle();
  });
  ui.modeOptions.forEach((option) => {
    option.addEventListener('change', () => {
      if (!option.checked) return;
      state.outputMode = option.value;
      updateModeUi();
    });
  });
  window.addEventListener('pagehide', () => {
    revokeUrls();
    revokePreviewUrl();
    controller.dispose();
  });
}
function init() {
  bindDragAndDrop();
  bindControls();
  const support = checkBrowserSupport();
  if (!support.supported) {
    renderIdle();
    renderUnsupported(support);
    return;
  }
  state.supported = true;
  renderIdle();
}
init();
