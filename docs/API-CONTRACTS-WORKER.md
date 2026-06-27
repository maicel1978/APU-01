# API CONTRACTS WORKER — Audio WAV Clínico / APU-01

PRISMA+ v5.2 — Detalle Worker del protocolo 1.2.0

Documento padre:
- `docs/API-CONTRACTS.md`

Extensión APU-01.1:
- `docs/APU-01-1-API-CONTRACTS.md`

## 1. Transporte

Sin build step se usa `MessageChannel` directo.

Inicialización Core → Worker por `worker.postMessage`:

```ts
{
  protocolVersion: '1.2.0',
  type: 'INIT_PORT',
  id: 'transport',
  payload: {}
}
```

Transferable:
- `MessagePort` como segundo puerto del canal.

Después de `INIT_PORT`, los mensajes de conversión viajan por el `MessagePort`.

---

## 2. Envoltura de mensajes

```ts
{
  protocolVersion: '1.2.0',
  type: string,
  id: string,
  payload?: unknown
}
```

Errores Worker → Core:

```ts
{
  protocolVersion: '1.2.0',
  type: 'ERROR',
  id: string,
  message: string,
  details?: unknown
}
```

Regla:
- `details` no se muestra directamente al usuario.

---

## 3. Core → Worker

### `PING`

```ts
{ protocolVersion: '1.2.0', type: 'PING', id: string }
```

Respuesta:
- `PONG`.

### `LOAD_ENGINE`

```ts
{
  protocolVersion: '1.2.0',
  type: 'LOAD_ENGINE',
  id: string,
  payload: {
    wasmBasePath?: string,
    singleThread: true
  }
}
```

Respuesta:
- `ENGINE_READY` o `ERROR`.

### `CONVERT_AUDIO`

```ts
{
  protocolVersion: '1.2.0',
  type: 'CONVERT_AUDIO',
  id: string,
  payload: {
    fileName: string,
    inputBuffer: ArrayBuffer,
    inputExtension: 'mp3' | 'ogg' | 'wav',
    outputFileName: string,
    outputMode: 'standard-wav' | 'transcription-prep',
    reportEvery: number
  }
}
```

Transferables:
- `inputBuffer` como transferable.

Respuesta esperada:
- `STATE`.
- `ENGINE_READY`.
- `PROGRESS` cero o más veces.
- `CONVERSION_COMPLETE` una vez.
- `ERROR` si falla.
- `CANCELLED` si se cancela.

Reglas:
- Audio siempre se procesa en Worker.
- Worker verifica cancelación cuando es posible.
- Si FFmpeg no permite cancelación fina, el Worker termina el motor FFmpeg interno.

### `CANCEL`

```ts
{
  protocolVersion: '1.2.0',
  type: 'CANCEL',
  id: string,
  payload: { reason: 'user_requested' }
}
```

Respuesta:
- `CANCELLED`.

### `DISPOSE`

```ts
{ protocolVersion: '1.2.0', type: 'DISPOSE', id: string }
```

Respuesta:
- `DISPOSED` si es posible.

---

## 4. Worker → Core

### `PONG`

```ts
{
  protocolVersion: '1.2.0',
  type: 'PONG',
  id: string,
  payload: { workerReady: true }
}
```

### `ENGINE_READY`

```ts
{
  protocolVersion: '1.2.0',
  type: 'ENGINE_READY',
  id: string,
  payload: { engine: 'ffmpeg.wasm', singleThread: true }
}
```

### `STATE`

```ts
{
  protocolVersion: '1.2.0',
  type: 'STATE',
  id: string,
  payload: {
    state: 'loading-engine' | 'engine-ready' | 'reading-input' | 'converting' | 'writing-output' | 'cleanup',
    message: string
  }
}
```

### `PROGRESS`

```ts
{
  protocolVersion: '1.2.0',
  type: 'PROGRESS',
  id: string,
  payload: {
    ratio: number | null,
    percent: number | null,
    message: string
  }
}
```

### `CONVERSION_COMPLETE`

```ts
{
  protocolVersion: '1.2.0',
  type: 'CONVERSION_COMPLETE',
  id: string,
  payload: {
    outputBuffer: ArrayBuffer,
    outputFileName: string,
    outputMimeType: 'audio/wav',
    outputMode: 'standard-wav' | 'transcription-prep'
  }
}
```

Transferables:
- `outputBuffer` como transferable.

### `CANCELLED`

```ts
{
  protocolVersion: '1.2.0',
  type: 'CANCELLED',
  id: string,
  payload: { message: 'Conversión cancelada.' }
}
```

### `ERROR`

```ts
{
  protocolVersion: '1.2.0',
  type: 'ERROR',
  id: string,
  message: string,
  details?: unknown
}
```
