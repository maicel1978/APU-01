/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Fallback local con Web Audio API para formatos que FFmpeg.wasm no decodifique.*
**/

import { OUTPUT_MODES } from './processing-profiles.js';

const FALLBACK_EXTENSIONS = new Set(['aac', 'm4a', 'mp4', 'webm', 'flac', 'mp3', 'ogg', 'oga', 'opus']);

export function canUseBrowserAudioFallback(fileDescriptor) {
  const AudioContextCtor = globalThis.AudioContext || globalThis.webkitAudioContext;
  return Boolean(fileDescriptor?.file && FALLBACK_EXTENSIONS.has(fileDescriptor.extension) && AudioContextCtor);
}

export async function convertWithBrowserAudioFallback({ fileDescriptor, outputMode, outputFileName }) {
  const audioBuffer = await decodeWithBrowser(fileDescriptor.file);
  const target = createTargetBuffer(audioBuffer, outputMode);
  const outputBuffer = encodeWavPcm16(target.channels, target.sampleRate);
  const outputBlob = new Blob([outputBuffer], { type: 'audio/wav' });

  return {
    outputBlob,
    outputFileName,
    wavInfo: {
      channels: target.channels.length,
      sampleRate: target.sampleRate,
      bitsPerSample: 16,
    },
  };
}

async function decodeWithBrowser(file) {
  const AudioContextCtor = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextCtor) throw new Error('Web Audio API no está disponible.');

  const context = new AudioContextCtor();
  try {
    const inputBuffer = await file.arrayBuffer();
    return await context.decodeAudioData(inputBuffer.slice(0));
  } finally {
    await context.close?.();
  }
}

function createTargetBuffer(audioBuffer, outputMode) {
  if (outputMode === OUTPUT_MODES.transcriptionPrep) {
    return {
      sampleRate: 16000,
      channels: [resampleToMono(audioBuffer, 16000)],
    };
  }

  const channelCount = Math.min(Math.max(audioBuffer.numberOfChannels, 1), 2);
  return {
    sampleRate: audioBuffer.sampleRate,
    channels: Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index).slice()),
  };
}

function resampleToMono(audioBuffer, targetRate) {
  const sourceRate = audioBuffer.sampleRate;
  const outputLength = Math.max(1, Math.round(audioBuffer.duration * targetRate));
  const output = new Float32Array(outputLength);
  const ratio = sourceRate / targetRate;

  for (let index = 0; index < outputLength; index += 1) {
    const sourceIndex = index * ratio;
    let mixed = 0;
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
      mixed += interpolate(audioBuffer.getChannelData(channel), sourceIndex);
    }
    output[index] = mixed / audioBuffer.numberOfChannels;
  }

  return output;
}

function interpolate(samples, index) {
  const before = Math.floor(index);
  const after = Math.min(before + 1, samples.length - 1);
  const fraction = index - before;
  return samples[before] * (1 - fraction) + samples[after] * fraction;
}

function encodeWavPcm16(channels, sampleRate) {
  const channelCount = channels.length;
  const frameCount = channels[0].length;
  const dataSize = frameCount * channelCount * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channelCount * 2, true);
  view.setUint16(32, channelCount * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  writeSamples(view, channels, frameCount, channelCount);
  return buffer;
}

function writeSamples(view, channels, frameCount, channelCount) {
  let offset = 44;
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channels[channel][frame] || 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
}

function writeString(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
}
