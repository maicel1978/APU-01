# APU-01.1 IMPLEMENTATION PLAN

PRISMA+ v5.2 — Fase 1 de iteración APU-01.1

## 1. Objetivo técnico

Añadir un modo de salida nuevo sin romper el modo actual.

```text
standard-wav       → comportamiento actual
transcription-prep → WAV mono 16 kHz 16-bit + manifest
```

## 2. Orden recomendado de implementación

### Fase 2 — UI + CSS

Cambios:
- Añadir selector de modo.
- Preseleccionar “WAV para transcripción”.
- Actualizar textos de ayuda.
- Añadir botón secundario para manifest JSON.
- Mantener accesibilidad por teclado.

Archivos previstos:
- `index.html`
- `src/styles/main.css`
- `src/ui/app.js`

### Fase 3 — Core

Cambios:
- Aceptar `.wav` en validación.
- Añadir perfiles de procesamiento.
- Calcular nombre de salida por modo.
- Generar manifest en Core o mapearlo desde Worker.
- Actualizar tests Core.

Archivos previstos:
- `src/core/file-validation.js`
- `src/core/conversion-controller.js`
- `src/core/processing-profiles.js`
- `src/core/manifest.js`
- `src/core/index.js`
- `tests/core-smoke.mjs`

### Fase 4 — Worker

Cambios:
- Añadir `outputMode` al payload.
- Construir comandos FFmpeg por modo.
- Para `transcription-prep`, usar pipeline conservador.
- Devolver manifest o metadatos para manifest.

Archivo previsto:
- `src/workers/audio-conversion.worker.js`

### Fase 5 — QA

Cambios:
- Tests de validación `.wav`.
- Auditoría de contratos 1.2.0 cuando el código esté actualizado.
- Smoke manual de ambos modos.
- Actualizar README y CHANGELOG.

## 3. Pipeline Worker planificado

### `standard-wav`

Mantener equivalente al comportamiento actual:

```text
-i input -vn -acodec pcm_s16le output.wav
```

### `transcription-prep`

Pipeline conservador:

```text
-i input
-vn
-ac 1
-ar 16000
-af highpass=f=80,dynaudnorm,acompressor
-acodec pcm_s16le
output_prepared.wav
```

## 4. Riesgos de implementación

| Riesgo | Mitigación |
|---|---|
| Romper modo estándar | Mantener comandos separados |
| UI más compleja | Dos opciones simples, sin parámetros técnicos |
| Manifest incompleto | Schema mínimo y versionado |
| Tests fallan por protocolo intermedio | Mantener contratos planificados separados hasta actualizar código |
| Archivo CSS supera R10 | Dividir CSS si crece más |

## 5. Criterio de avance

No iniciar código hasta que esta Fase 1 sea aprobada.

Antes de cada archivo de código se debe mostrar PRE-CÓDIGO con contratos aplicables.
