# APU-01.1 API CONTRACTS — Modo Preparar para transcripción

PRISMA+ v5.2 — Fase 1 de iteración APU-01.1

## 1. Estado del contrato

```text
Current implemented protocol: 1.1.0
Planned APU-01.1 protocol: 1.2.0
Runtime: Vanilla JS ES2022+ Modules
Transport: MessageChannel directo
```

Este documento define la extensión planificada para APU-01.1. El protocolo activo de la app sigue siendo `1.1.0` hasta que la implementación se complete.

## 2. Nuevos conceptos

### `OutputMode`

```ts
'standard-wav' | 'transcription-prep'
```

### `ProcessingProfile`

```ts
{
  outputMode: OutputMode,
  label: string,
  description: string,
  target?: {
    container: 'wav',
    codec: 'pcm_s16le',
    channels: 1,
    sampleRate: 16000,
    bitDepth: 16
  }
}
```

### `PreparedManifest`

```ts
{
  schemaVersion: '1.0.0',
  ecosystem: 'APU',
  unit: 'APU-01',
  stage: 'prepared-audio',
  source: {
    fileName: string,
    format: 'mp3' | 'ogg' | 'wav',
    sizeBytes: number
  },
  output: {
    fileName: string,
    format: 'wav',
    channels: 1,
    sampleRate: 16000,
    bitDepth: 16
  },
  processing: {
    mode: 'transcription-prep',
    highPassFilter: true,
    dynamicNormalization: true,
    lightCompression: true,
    silenceHandling: 'preserve-significant-pauses'
  },
  privacy: {
    processedLocally: true,
    networkUpload: false
  }
}
```

## 3. UI → Core

### `validateAudioFile(file)`

Cambio planificado:
- Debe aceptar `.wav` además de `.mp3` y `.ogg`.

Extensiones válidas:

```ts
'mp3' | 'ogg' | 'wav'
```

Nuevo error recomendado:

| Código | Mensaje |
|---|---|
| `ERR_UNSUPPORTED_FORMAT` | “Este formato no está soportado. Usa MP3, OGG o WAV.” |

### `getProcessingProfiles()`

Nueva función planificada.

Salida:

```ts
Array<ProcessingProfile>
```

Debe devolver al menos:

```ts
[
  { outputMode: 'transcription-prep', label: 'WAV para transcripción', ... },
  { outputMode: 'standard-wav', label: 'WAV estándar', ... }
]
```

Regla UX:
- `transcription-prep` debe aparecer como recomendado.

### `createConversionController(options)`

`convert()` recibirá opciones de conversión:

```ts
convert(fileDescriptor, conversionOptions, callbacks)
```

Donde:

```ts
{
  outputMode: 'standard-wav' | 'transcription-prep'
}
```

## 4. Resultado de conversión

### Modo estándar

```ts
{
  id: string,
  outputMode: 'standard-wav',
  outputBlob: Blob,
  outputFileName: string,
  outputMimeType: 'audio/wav',
  outputSizeBytes: number,
  manifest: null
}
```

### Modo transcripción

```ts
{
  id: string,
  outputMode: 'transcription-prep',
  outputBlob: Blob,
  outputFileName: string,
  outputMimeType: 'audio/wav',
  outputSizeBytes: number,
  manifest: PreparedManifest
}
```

## 5. Core → Worker planificado

`CONVERT_AUDIO` añadirá:

```ts
payload: {
  fileName: string,
  inputBuffer: ArrayBuffer,
  inputExtension: 'mp3' | 'ogg' | 'wav',
  outputFileName: string,
  outputMode: 'standard-wav' | 'transcription-prep',
  reportEvery: number
}
```

## 6. Worker → Core implementado

`CONVERSION_COMPLETE` añadirá:

```ts
payload: {
  outputBuffer: ArrayBuffer,
  outputFileName: string,
  outputMimeType: 'audio/wav',
  outputMode: 'standard-wav' | 'transcription-prep',
  manifest: PreparedManifest | null
}
```

## 7. Estados UI añadidos

No se añaden estados globales nuevos. Se reutilizan:

```ts
'file-ready'
'engine-loading'
'converting'
'completed'
'cancelled'
'error'
```

La diferencia de modo se representa mediante `outputMode`.

## 8. Reglas

1. La UI no llama Worker directamente.
2. Core no manipula DOM.
3. Worker no manipula DOM.
4. WAV para transcripción no debe recortar silencios agresivamente.
5. Manifest solo se genera para `transcription-prep`.
6. Todo procesamiento pesado continúa en Worker.
7. No se envía audio a red.
