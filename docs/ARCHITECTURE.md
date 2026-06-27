# ARCHITECTURE — Audio WAV Clínico

PRISMA+ v5.2 — Actualizado al final de Fase 4

## 1. Objetivo arquitectónico

App web estática, minimalista y robusta para convertir audio MP3/OGG a WAV localmente, orientada a médicos e investigadores con pocos conocimientos técnicos.

Prioridades:
- No bloquear la interfaz.
- Mantener privacidad local.
- Separar UI, Core y Worker.
- Validar antes de procesar.
- Mostrar errores claros y no técnicos.

## 2. Stack

```text
Runtime: HTML5 + CSS3 + Vanilla JS ES2022+ Modules
Build step: No
Frameworks runtime: No
Vite: No
ESLint/Prettier: No en MVP
Transporte Worker: MessageChannel directo
Procesamiento pesado: Web Worker obligatorio
Motor: FFmpeg.wasm single-thread local
CDN obligatoria: Ninguna
```

## 3. Capas

```text
UI → Core → Worker → FFmpeg.wasm
```

### UI — `/src/ui`

Archivo:
- `src/ui/app.js`

Responsabilidades:
- DOM, eventos y render de estados.
- Drag & drop.
- Mensajes accesibles mediante `aria-live`.
- Foco visible y navegación por teclado.
- Llamar solo a Core.
- Crear URL de descarga del WAV recibido desde Core.

La UI no:
- No procesa audio.
- No invoca Worker directamente.
- No muestra detalles técnicos crudos.

### Core — `/src/core`

Archivos:
- `src/core/index.js`
- `src/core/support.js`
- `src/core/memory.js`
- `src/core/file-validation.js`
- `src/core/conversion-controller.js`

Responsabilidades:
- Detección de capacidades del navegador.
- Validación de archivo.
- Estimación defensiva de memoria.
- Errores de usuario.
- Orquestación Worker mediante `MessageChannel`.
- Transferencia de `ArrayBuffer` entrada/salida.

### Worker — `/src/workers`

Archivo:
- `src/workers/audio-conversion.worker.js`

Responsabilidades:
- Recibir audio validado desde Core.
- Cargar FFmpeg.wasm local.
- Convertir MP3/OGG a WAV.
- Emitir estados y progreso.
- Cancelar mediante terminación del motor FFmpeg interno.
- Limpiar archivos temporales.
- Devolver WAV como `ArrayBuffer` transferable.

### Assets vendor — `/assets/vendor/ffmpeg`

Incluye:
- `@ffmpeg/ffmpeg@0.12.15`
- `@ffmpeg/core@0.12.10`
- `ffmpeg-core.wasm`

Motivo:
- Evitar dependencia de red.
- Mejorar privacidad y robustez en redes clínicas/académicas.

## 4. Contratos activos

Documentos:
- `docs/API-CONTRACTS.md`
- `docs/API-CONTRACTS-WORKER.md`

Versión:

```text
Protocol Version: 1.1.0
```

Cambio Fase 4:
- Se añadió `INIT_PORT` para inicializar `MessageChannel`.

### UI → Core implementado

- `checkBrowserSupport()`
- `validateAudioFile(file)`
- `estimateProcessingMemory(file)`
- `createConversionController(options)`

### Core → Worker implementado

- `INIT_PORT`
- `CONVERT_AUDIO`
- `CANCEL`
- `DISPOSE`

Soportado por Worker:
- `PING`
- `LOAD_ENGINE`

### Worker → Core implementado

- `ENGINE_READY`
- `STATE`
- `PROGRESS`
- `CONVERSION_COMPLETE`
- `CANCELLED`
- `ERROR`
- `DISPOSED`

## 5. Validación defensiva

`validateAudioFile(file)` aplica:
- Archivo presente.
- Tamaño mayor que cero.
- Extensión `.mp3` o `.ogg`.
- Caso `.pm3` con mensaje claro.
- MIME compatible si el navegador lo informa.
- Estimación de memoria antes de procesar.

Errores principales:
- `ERR_NO_FILE`
- `ERR_EMPTY_FILE`
- `ERR_PM3_EXTENSION`
- `ERR_UNSUPPORTED_FORMAT`
- `ERR_FILE_TOO_LARGE`
- `ERR_CONVERSION_FAILED`
- `ERR_WORKER_MEMORY`
- `ERR_CANCELLED`

## 6. Memoria

Estimación actual:

```text
estimatedBytes = max(file.size × 12, 256 MB)
```

Criterios:
- Si `performance.memory.jsHeapSizeLimit` existe: usar hasta 60% del heap.
- Si no existe: limitar entrada a 50 MB.
- Una sola conversión activa en MVP.

## 7. Privacidad y red

- El audio no se sube a servidores.
- No hay telemetría.
- No hay CDN obligatoria.
- FFmpeg.wasm se sirve como asset local.
- La app requiere cargar archivos locales del propio sitio, no servicios externos.

## 8. Progreso y cancelación

Progreso:
- FFmpeg emite progreso cuando está disponible.
- El Worker envía `PROGRESS` respetando `reportEvery`.
- Si el ratio no es confiable, la UI mantiene mensaje de actividad.

Cancelación:
- UI llama `controller.cancel(id)`.
- Core envía `CANCEL` por `MessageChannel`.
- Worker termina el motor FFmpeg interno y responde `CANCELLED`.
- La app permite intentar de nuevo tras cancelar.

## 9. Accesibilidad

Implementado:
- HTML semántico.
- `aria-live="polite"` para estado.
- `aria-live="assertive"` para errores.
- Foco visible.
- Botones con texto explícito.
- Selector de archivo con label.
- Drag & drop complementario, no único mecanismo.

## 10. Trade-offs

| Decisión | Ventaja | Coste |
|---|---|---|
| Sin build step | Portabilidad y claridad | Menos automatización |
| FFmpeg.wasm local | Robustez y privacidad | ~31 MB de assets |
| MessageChannel | Contrato Worker más explícito | Más código que postMessage directo |
| Una conversión activa | Menos cuelgues y UX simple | Sin lote en MVP |
| Cancelar terminando motor | Más seguro | Requiere recargar FFmpeg después |

## 11. Estado actual

Completado:
- Documentación base.
- UI/CSS.
- Validación Core.
- Estimación de memoria.
- Errores de usuario.
- Worker real.
- FFmpeg.wasm local.
- Integración UI → Core → Worker.
- Descarga WAV mediante Blob URL.

## 12. Extensión APU-01.1 planificada

APU-01.1 añadirá:

```text
standard-wav
transcription-prep
```

El modo `transcription-prep` generará:

```text
WAV mono, 16 kHz, 16-bit PCM
manifest.json
```

Contratos específicos:
- `docs/APU-01-1-API-CONTRACTS.md`
- `docs/APU-01-1-MANIFEST-SCHEMA.md`

El protocolo implementado fue actualizado a `1.2.0`.

APU-01.1 implementa:
- perfiles de procesamiento;
- validación WAV;
- generación de manifest;
- firma `convert(fileDescriptor, conversionOptions, callbacks)`;
- `outputMode` en Core y Worker;
- pipeline real `transcription-prep` en Worker;
- descarga de manifest JSON desde la UI.

Pipeline `transcription-prep`:

```text
-i input -vn -ac 1 -ar 16000 -af highpass=f=80,dynaudnorm,acompressor -acodec pcm_s16le output.wav
```
