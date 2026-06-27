# API CONTRACTS — Audio WAV Clínico / APU-01

PRISMA+ v5.2 — Actualizado en APU-01.1 Fase 4

## Versión del protocolo

```text
Protocol Version: 1.2.0
Runtime: Vanilla JS ES2022+ Modules
Build step: No
Worker transport: MessageChannel directo
```

Cambio 1.2.0:
- `CONVERT_AUDIO` incluye `outputMode`.
- `CONVERSION_COMPLETE` devuelve `outputMode`.
- Core soporta `standard-wav` y `transcription-prep`.
- Core genera manifest JSON para `transcription-prep`.

Detalle completo de mensajes Worker:
- `docs/API-CONTRACTS-WORKER.md`

Contratos específicos APU-01.1:
- `docs/APU-01-1-API-CONTRACTS.md`
- `docs/APU-01-1-MANIFEST-SCHEMA.md`

---

## 1. Modelo de dominio

### `OutputMode`

```ts
'standard-wav' | 'transcription-prep'
```

### `AudioFileDescriptor`

```ts
{
  id: string,
  file: File,
  name: string,
  extension: 'mp3' | 'ogg' | 'wav',
  mimeType: string,
  sizeBytes: number,
  outputFileName: string,
  status: 'selected' | 'checking' | 'ready' | 'processing' | 'completed' | 'cancelled' | 'error'
}
```

### `ConversionResult`

```ts
{
  id: string,
  outputMode: OutputMode,
  outputBlob: Blob,
  outputFileName: string,
  outputMimeType: 'audio/wav',
  outputSizeBytes: number,
  manifest: PreparedManifest | null
}
```

### `UserFacingError`

```ts
{
  code: string,
  message: string,
  suggestion?: string,
  recoverable: boolean,
  details?: unknown
}
```

Regla:
- `details` no debe mostrarse directamente al usuario.

---

## 2. UI → Core

La UI solo llama funciones exportadas por Core. No invoca Workers directamente.

### `checkBrowserSupport()`

Salida:

```ts
{
  supported: boolean,
  missing: Array<'File API' | 'Blob URLs' | 'Web Workers' | 'MessageChannel' | 'WebAssembly' | 'ES Modules'>,
  message: string
}
```

### `validateAudioFile(file)`

Entrada:

```ts
File
```

Salida exitosa:

```ts
AudioFileDescriptor
```

Formatos aceptados:

```text
MP3, OGG, WAV
```

Errores esperados:

| Código | Mensaje de usuario recomendado |
|---|---|
| `ERR_NO_FILE` | “No se seleccionó ningún archivo.” |
| `ERR_UNSUPPORTED_FORMAT` | “Este formato no está soportado. Usa MP3, OGG o WAV.” |
| `ERR_PM3_EXTENSION` | “No reconocemos .pm3. Si querías usar MP3, revisa el nombre del archivo.” |
| `ERR_EMPTY_FILE` | “El archivo está vacío.” |
| `ERR_FILE_TOO_LARGE` | “Este archivo es demasiado grande para procesarlo de forma segura en este navegador.” |

---

### `getProcessingProfiles()`

Salida:

```ts
Array<ProcessingProfile>
```

Debe incluir:
- `transcription-prep` recomendado.
- `standard-wav` alternativo.

---

### `createConversionController(options)`

Entrada:

```ts
{
  workerUrl: string | URL,
  reportEvery?: number
}
```

Salida:

```ts
{
  convert(fileDescriptor, conversionOptions, callbacks): Promise<ConversionResult>,
  cancel(id): void,
  dispose(): void
}
```

`conversionOptions`:

```ts
{
  outputMode: 'standard-wav' | 'transcription-prep'
}
```

Reglas:
- Solo permite una conversión activa a la vez en MVP.
- Si ya hay conversión activa, rechazar con `ERR_CONVERSION_ACTIVE`.
- Mapear errores técnicos Worker a `UserFacingError`.

---

## 3. Manifest

Core genera manifest solo para:

```text
transcription-prep
```

Utilidades:

```ts
createPreparedManifest(args)
createManifestBlob(manifest)
manifestFileNameFromWav(outputFileName)
```

Schema:
- `docs/APU-01-1-MANIFEST-SCHEMA.md`

---

## 4. Estados UI autorizados

```ts
'idle'
| 'unsupported-browser'
| 'file-checking'
| 'file-ready'
| 'engine-loading'
| 'converting'
| 'cancelling'
| 'completed'
| 'cancelled'
| 'error'
```

---

## 5. Mensajes visibles base

| Situación | Mensaje visible recomendado |
|---|---|
| Inicio | “Selecciona un archivo MP3, OGG o WAV para comenzar.” |
| Privacidad | “El audio se procesa en este navegador y no se sube a servidores.” |
| Preparando motor | “Preparando el conversor…” |
| Modo transcripción | “Preparando audio para transcripción…” |
| Modo estándar | “Convirtiendo audio…” |
| Cancelando | “Cancelando conversión…” |
| Completado | “Archivo WAV listo.” |
| Manifest | “Audio preparado y manifest listos para descargar.” |
| Formato inválido | “Este formato no está soportado. Usa MP3, OGG o WAV.” |
| Archivo grande | “Este archivo es demasiado grande para procesarlo de forma segura en este navegador.” |

---

## 6. Reglas transversales

1. UI no accede al Worker directamente.
2. Core no manipula DOM.
3. Worker no manipula DOM.
4. No se envía audio a red.
5. Una sola conversión activa en MVP.
6. Todo `.js` inicia con comentario PRISMA+ R14.
7. Antes de generar código debe mostrarse PRE-CÓDIGO R13.
8. Cualquier tarea >1s tiene progreso y cancelación.
9. Detalles Worker: `docs/API-CONTRACTS-WORKER.md`.
