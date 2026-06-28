# CHANGELOG — Audio WAV Clínico

PRISMA+ v5.2

## [0.7.0] — Versión estable Netlify / MIT

### Añadido
- Servidor local Node.js multiplataforma `serve.mjs` con headers COOP/COEP.
- Fallback local con Web Audio API para mejorar compatibilidad con AAC/M4A/MP4/WEBM/FLAC cuando FFmpeg.wasm no pueda decodificar un archivo.
- Script Windows `SUBIR_A_GITHUB.bat` para flujo de subida asistido.
- Página `404.html`, `manifest.json`, `robots.txt` y configuración Netlify reforzada.
- Auditoría final en `docs/FINAL-AUDIT.md`.

### Cambiado
- GitHub Actions actualizado a `actions/checkout@v5` y `actions/setup-node@v5`.
- `npm start` usa Node.js en lugar de `python3`, compatible con Windows/macOS/Linux.
- Pipeline de preparación estabilizado: WAV mono, 16 kHz, PCM 16-bit, sin filtros agresivos.
- Documentación alineada con despliegue Netlify y licencia MIT.

### Verificado
- `npm test`: OK.
- Deploy Netlify: OK.
- Conversión WAV: OK.
- Conversión AAC mediante fallback local: OK.
- Privacidad local-first: OK.
- Licencia MIT presente en `LICENSE`.


## [0.6.1-docs] — GitHub publishing + APU handoff

### Añadido
- `docs/GITHUB-PUBLISHING.md`.
- `docs/RELEASE-CHECKLIST.md`.
- `docs/APU-HANDOFF.md`.
- `docs/APU-02-STARTER.md`.

### Cambiado
- `docs/INDEX.md` reorganizado con secciones de publicación y continuidad del ecosistema.
- `docs/CURRENT-STATUS.md` actualizado con rutas separadas: publicar APU-01.1 o iniciar APU-02 en otra sección.
- `docs/PROJECT-TREE.md` actualizado.

### Decisión
- APU-02 queda documentado como futura unidad separada.
- No se implementa APU-02 dentro de APU-01.

## [0.6.0] — APU-01.1 completado

### Añadido
- Modo `WAV para transcripción`.
- Entrada `.wav` además de `.mp3` y `.ogg`.
- Salida `[base]_prepared.wav`.
- Manifest JSON descargable.
- Pipeline FFmpeg mono 16 kHz 16-bit.
- Protocolo runtime `1.2.0`.

### Verificado
- `npm test`: OK.
- Sintaxis JS: OK.
- Assets principales por HTTP local: OK.
- R1/R10/R14: OK.

## [0.6.0-worker] — APU-01.1 Fase 4

### Añadido
- Worker con protocolo runtime `1.2.0`.
- Payload `outputMode` para `standard-wav` y `transcription-prep`.
- Pipeline FFmpeg para WAV mono 16 kHz 16-bit.
- Descarga de manifest JSON desde UI.

## [0.6.0-core] — APU-01.1 Fase 3

### Añadido
- `src/core/processing-profiles.js`.
- `src/core/manifest.js`.
- Tests Core para entrada WAV, perfiles y manifest.

## [0.6.0-ui] — APU-01.1 Fase 2

### Añadido
- Selector de modo de salida en `index.html`.
- `src/styles/modes.css`.
- Estado UI `outputMode` en `src/ui/app.js`.

## [0.6.0-planning] — APU-01.1 Fase -1 a Fase 1

### Añadido
- Documentos de alcance, viabilidad, contratos, manifest y plan de implementación APU-01.1.

## [0.5.2] — Documentación de ecosistema APU

### Añadido
- Documentos de ecosistema APU, estándares comunes, roadmap, glosario, ética y contratos de datos.

## [0.5.1] — Preparación para GitHub

### Añadido
- `README.md`.
- `.gitignore`.
- `package.json` con scripts `npm start` y `npm test`.
- `.github/workflows/ci.yml`.
- `docs/INDEX.md`.

## [0.5.0] — Fase 5 Robustez + pulido final

### Añadido
- `tests/core-smoke.mjs`.
- `tests/static-audit.mjs`.
- `docs/QA-REPORT.md`.
- `docs/AGENT-GUIDE.md`.

## [0.4.0] — Fase 4 Worker + orquestación

### Añadido
- Worker real `src/workers/audio-conversion.worker.js`.
- FFmpeg.wasm local en `assets/vendor/ffmpeg`.
- Conversión MP3/OGG a WAV en Worker.

## [0.3.0] — Fase 3 Core

### Añadido
- Validación de archivos.
- Estimación defensiva de memoria.
- Errores de usuario tipados.

## [0.2.0] — Fase 2 UI + CSS

### Añadido
- `index.html`.
- `src/styles/main.css`.
- `src/ui/app.js`.

## [0.1.0] — Fase 1 Estructura + contratos

### Añadido
- Estructura `/src`, `/assets`, `/docs`.
- `docs/API-CONTRACTS.md`.

## [0.0.2] — Fase 0 Viabilidad + stack

### Decidido
- Vanilla puro sin build step.
- FFmpeg.wasm en Worker.
- Sin CDN obligatoria.

## [0.0.1] — Fase -1 Descubrimiento

### Añadido
- `docs/SCOPE.md`.
- `docs/ACCEPTANCE-CRITERIA.md`.
- `docs/UX-FLOW.md`.
