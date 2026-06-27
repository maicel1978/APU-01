# APU Common Standards

PRISMA+ v5.2 — Estándares comunes del ecosistema

## 1. Objetivo

Definir estándares comunes para que las futuras herramientas APU puedan intercambiar archivos de forma clara, privada y auditable.

Aplica a:
- APU-01 Preparación Acústica.
- APU-02 Transcripción.
- APU-03 Diarización.
- APU-04 Limpieza textual.
- APU-05 Análisis cualitativo.
- APU-06 Exportación.

## 2. Principios comunes

1. Privacidad por defecto.
2. Procesamiento local siempre que sea viable.
3. Sin red salvo consentimiento explícito.
4. Archivos exportables y legibles.
5. Trazabilidad entre etapas.
6. Revisión humana en etapas interpretativas.
7. Separación entre datos originales, procesados y analizados.
8. Nunca sobrescribir el archivo original.

## 3. Convenciones de nombres

Formato recomendado:

```text
[study]_[case]_[stage].[ext]
```

Ejemplos:

```text
oncologia_p001_original.mp3
oncologia_p001_prepared.wav
oncologia_p001_manifest.json
oncologia_p001_transcript.json
oncologia_p001_speakers.json
oncologia_p001_codes.json
```

Si no hay estudio/caso definido, usar:

```text
audio_prepared.wav
```

## 4. Etapas estándar

| Etapa | Sufijo | Descripción |
|---|---|---|
| Original | `_original` | Archivo fuente sin modificar |
| Preparado | `_prepared` | Audio estándar para transcripción |
| Transcrito | `_transcript` | Texto con timestamps |
| Hablantes | `_speakers` | Texto con turnos de habla |
| Limpio | `_clean` | Texto revisado/estructurado |
| Codificado | `_codes` | Códigos cualitativos |
| Temas | `_themes` | Temas o categorías |
| Reporte | `_report` | Resultado comunicable |

## 5. Estándar de audio preparado

Para transcripción automática, la salida recomendada de APU-01 es:

```text
Formato: WAV
Codificación: PCM signed 16-bit little-endian
Canales: 1 canal mono
Frecuencia: 16 kHz
Extensión: .wav
```

Nombre recomendado:

```text
[base]_prepared.wav
```

Nota:
- Este formato no garantiza mejor transcripción en todos los casos, pero mejora consistencia y compatibilidad.

## 6. Manifest de preparación acústica

APU-01 debería generar en una evolución futura:

```text
[base]_manifest.json
```

Estructura recomendada:

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
  "processing": {
    "mode": "transcription-prep",
    "noiseReduction": "conservative",
    "volumeNormalization": true,
    "silenceHandling": "preserve-significant-pauses"
  },
  "privacy": {
    "processedLocally": true,
    "networkUpload": false
  }
}
```

## 7. Estándar de transcripción

APU-02 debería producir JSON con segmentos:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-02",
  "stage": "transcript",
  "segments": [
    {
      "id": "seg-001",
      "start": 0.0,
      "end": 4.2,
      "text": "Buenos días, gracias por participar.",
      "confidence": null
    }
  ]
}
```

## 8. Estándar de hablantes

APU-03 debería añadir hablantes sin destruir el transcript original:

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
      "text": "Buenos días, gracias por participar."
    }
  ]
}
```

## 9. Estándar de análisis cualitativo

APU-05 debería conservar trazabilidad hacia segmentos originales.

Ejemplo de código:

```json
{
  "codeId": "code-001",
  "label": "Experiencia de dolor",
  "segmentIds": ["seg-014", "seg-021"],
  "memo": "Aparece asociado a limitación funcional."
}
```

Regla:
- Toda cita o tema debe poder rastrearse hasta segmentos de transcripción.

## 10. Reglas de privacidad

- Ninguna unidad debe enviar datos a red por defecto.
- Si una unidad usa proveedor externo, debe mostrarlo explícitamente antes de procesar.
- Los archivos clínicos o sensibles deben tratarse como datos confidenciales.
- No almacenar audios en navegador salvo decisión explícita del usuario.

## 11. Reglas para IA

Cuando una unidad use IA:
- Debe indicar si el modelo es local o externo.
- Debe permitir revisión humana.
- Debe separar resultado sugerido de resultado aceptado.
- Debe conservar trazabilidad.

## 12. Estado de este estándar

Este documento define una base inicial. Cualquier cambio incompatible debe versionarse mediante `schemaVersion` y documentarse en `CHANGELOG.md`.
