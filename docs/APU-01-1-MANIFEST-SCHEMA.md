# APU-01.1 MANIFEST SCHEMA

PRISMA+ v5.2 — Fase 1 de iteración APU-01.1

## 1. Objetivo

Definir el manifest JSON que acompaña al WAV preparado para transcripción.

Archivo recomendado:

```text
[base]_manifest.json
```

## 2. Schema inicial

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-01",
  "stage": "prepared-audio",
  "createdAt": "2026-06-24T00:00:00.000Z",
  "source": {
    "fileName": "entrevista_original.mp3",
    "format": "mp3",
    "sizeBytes": 123456
  },
  "output": {
    "fileName": "entrevista_prepared.wav",
    "format": "wav",
    "codec": "pcm_s16le",
    "channels": 1,
    "sampleRate": 16000,
    "bitDepth": 16
  },
  "processing": {
    "mode": "transcription-prep",
    "highPassFilter": true,
    "dynamicNormalization": true,
    "lightCompression": true,
    "silenceHandling": "preserve-significant-pauses"
  },
  "privacy": {
    "processedLocally": true,
    "networkUpload": false
  }
}
```

## 3. Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `schemaVersion` | string | Versión del manifest |
| `ecosystem` | string | Siempre `APU` |
| `unit` | string | Siempre `APU-01` |
| `stage` | string | `prepared-audio` |
| `source.fileName` | string | Nombre del archivo fuente |
| `source.format` | string | `mp3`, `ogg` o `wav` |
| `source.sizeBytes` | number | Tamaño de entrada |
| `output.fileName` | string | Nombre WAV generado |
| `output.channels` | number | Debe ser `1` |
| `output.sampleRate` | number | Debe ser `16000` |
| `output.bitDepth` | number | Debe ser `16` |
| `privacy.processedLocally` | boolean | Debe ser `true` |
| `privacy.networkUpload` | boolean | Debe ser `false` |

## 4. Reglas

1. El manifest no debe incluir contenido transcrito.
2. El manifest no debe incluir datos clínicos escritos por el usuario.
3. El manifest no debe contener rutas locales completas.
4. El manifest debe ser legible y descargable.
5. El manifest solo se genera para `transcription-prep`.

## 5. Uso posterior

APU-02 puede usar este manifest para saber que el audio ya está preparado:

```text
WAV mono, 16 kHz, 16-bit PCM
```

APU-03 y APU-05 deben preservar trazabilidad hacia este manifest cuando exista.
