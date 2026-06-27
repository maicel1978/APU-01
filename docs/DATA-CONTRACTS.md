# DATA CONTRACTS — APU Ecosystem

PRISMA+ v5.2 — Contratos de datos entre unidades

## 1. Objetivo

Definir archivos intercambiables entre unidades APU.

Estos contratos son iniciales y deben versionarse si cambian.

## 2. Versionado

Cada archivo JSON debe incluir:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU"
}
```

## 3. APU-01 salida recomendada

Archivos:

```text
[base]_prepared.wav
[base]_manifest.json
```

Manifest mínimo:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-01",
  "stage": "prepared-audio",
  "source": {
    "fileName": "entrevista_original.mp3",
    "format": "mp3"
  },
  "output": {
    "fileName": "entrevista_prepared.wav",
    "format": "wav",
    "channels": 1,
    "sampleRate": 16000,
    "bitDepth": 16
  },
  "privacy": {
    "processedLocally": true,
    "networkUpload": false
  }
}
```

## 4. APU-02 salida recomendada

Archivo:

```text
[base]_transcript.json
```

Estructura mínima:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-02",
  "stage": "transcript",
  "sourceAudio": "entrevista_prepared.wav",
  "segments": [
    {
      "id": "seg-001",
      "start": 0.0,
      "end": 4.2,
      "text": "Texto transcrito.",
      "confidence": null
    }
  ]
}
```

## 5. APU-03 salida recomendada

Archivo:

```text
[base]_speakers.json
```

Estructura mínima:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-03",
  "stage": "speaker-segmentation",
  "speakers": [
    { "id": "spk-1", "label": "Entrevistador" },
    { "id": "spk-2", "label": "Participante" }
  ],
  "segments": [
    {
      "id": "seg-001",
      "speakerId": "spk-1",
      "start": 0.0,
      "end": 4.2,
      "text": "Texto transcrito."
    }
  ]
}
```

## 6. APU-05 análisis cualitativo

Archivo:

```text
[base]_analysis.json
```

Estructura inicial:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-05",
  "stage": "qualitative-analysis",
  "codes": [
    {
      "id": "code-001",
      "label": "Experiencia de dolor",
      "segmentIds": ["seg-001"],
      "memo": "Interpretación revisada por investigador."
    }
  ]
}
```

## 7. Regla de trazabilidad

Toda salida analítica debe poder rastrearse hacia:

```text
resultado → código → segmento → transcripción → audio preparado → audio original
```

## 8. APU-01.1 manifest planificado

Documento específico:

```text
docs/APU-01-1-MANIFEST-SCHEMA.md
```

APU-01.1 debe generar manifest solo en modo:

```text
transcription-prep
```

El manifest debe acompañar a:

```text
[base]_prepared.wav
```

## 9. Estado

Estos contratos son una base para futuras unidades. APU-01 actual todavía no genera manifest; APU-01.1 lo implementará en una fase posterior.
