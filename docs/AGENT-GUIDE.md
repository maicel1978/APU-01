# AGENT GUIDE — Audio WAV Clínico / APU-01.1

PRISMA+ v5.2 — Guía para continuar o recuperar sesión

## 1. Identidad del proyecto

App: Audio WAV Clínico.

Unidad APU:

```text
APU-01 — Preparación Acústica
```

Estado actual:

```text
APU-01.1 — Modo Preparar para transcripción implementado
```

Objetivo:
- Convertir y preparar archivos MP3/OGG/WAV localmente en navegador.
- Público: médicos e investigadores con pocos conocimientos técnicos.
- Prioridad: robustez, privacidad y UX simple.

## 2. Stack obligatorio

```text
Runtime: HTML5 + CSS3 + Vanilla JS ES2022+ Modules
Frameworks runtime: prohibidos
Build step: no
Worker: obligatorio para audio
Transporte Worker: MessageChannel directo
Motor: FFmpeg.wasm local
CDN: ninguna obligatoria
```

## 3. Protocolo actual

```text
Protocol Version: 1.2.0
```

Cambio APU-01.1:
- `CONVERT_AUDIO` incluye `outputMode`.
- Worker soporta `standard-wav` y `transcription-prep`.
- Core genera manifest JSON para `transcription-prep`.

## 4. Modos

### `standard-wav`

Conversión simple a WAV PCM.

### `transcription-prep`

Salida:

```text
WAV mono, 16 kHz, 16-bit PCM
```

Pipeline:

```text
-i input -vn -ac 1 -ar 16000 -af highpass=f=80,dynaudnorm,acompressor -acodec pcm_s16le output.wav
```

Genera manifest JSON.

## 5. Archivos clave

| Archivo | Propósito |
|---|---|
| `index.html` | UI accesible de una pantalla |
| `src/styles/main.css` | Estilos base |
| `src/styles/modes.css` | Estilos de modos APU-01.1 |
| `src/ui/app.js` | UI, eventos, descargas WAV/manifest |
| `src/core/processing-profiles.js` | Perfiles de procesamiento |
| `src/core/manifest.js` | Manifest JSON |
| `src/core/file-validation.js` | Validación MP3/OGG/WAV |
| `src/core/conversion-controller.js` | Orquestación Core↔Worker |
| `src/workers/audio-conversion.worker.js` | Conversión FFmpeg.wasm |
| `tests/core-smoke.mjs` | Smoke tests Core |
| `tests/static-audit.mjs` | Auditoría PRISMA+ |

## 6. Cómo ejecutar

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

No usar `file://`.

## 7. Cómo probar

Automático:

```bash
npm test
```

Manual:
1. Cargar `.txt` → error formato.
2. Cargar `.pm3` → sugerencia MP3.
3. Modo estándar → convertir MP3/OGG/WAV.
4. Modo transcripción → generar WAV preparado + manifest.
5. Cancelar una conversión.
6. Confirmar que no hay red externa.

## 8. Reglas de mantenimiento

- No añadir frameworks runtime.
- No procesar audio en hilo principal.
- No subir audio a servidores sin cambio explícito de alcance.
- Si cambia protocolo Worker, actualizar:
  - `docs/API-CONTRACTS.md`.
  - `docs/API-CONTRACTS-WORKER.md`.
  - `docs/ARCHITECTURE.md`.
  - `tests/static-audit.mjs`.
- Todo `.js` nuevo debe empezar con cabecera PRISMA+ R14.
- Antes de generar código, mostrar PRE-CÓDIGO R13.
- Mantener archivos ≤350 líneas.

## 9. Riesgos conocidos

| Riesgo | Acción recomendada |
|---|---|
| Safari/iOS con menos memoria | Probar archivos pequeños |
| Assets FFmpeg pesan ~31 MB | Mantener local por privacidad |
| Progreso FFmpeg puede variar | Mantener mensajes textuales |
| Filtros no hacen milagros | Usar lenguaje prudente |
| `src/ui/app.js` cerca de R10 | Dividir si se amplía |

## 10. Recuperación de sesión

Si se pierde contexto, pegar:

1. Prompt PRISMA+ completo.
2. `docs/CURRENT-STATUS.md`.
3. `docs/ARCHITECTURE.md`.
4. Archivo específico que se quiera modificar.

Confirmar:
- Vanilla runtime.
- Worker obligatorio.
- Privacidad local.
- Contratos 1.2.0.
