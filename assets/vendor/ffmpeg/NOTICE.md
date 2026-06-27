# FFmpeg.wasm local assets

PRISMA+ v5.2 — Fase 4

Estos assets se incluyen localmente para evitar dependencia de red durante el uso normal de la app.

Paquetes fuente:
- `@ffmpeg/ffmpeg@0.12.15`
- `@ffmpeg/core@0.12.10`

Uso:
- Solo dentro de Web Worker.
- Sin telemetría.
- Sin subida de audio a servidores.

Licencias:
- Los paquetes npm declaran licencia MIT.
- FFmpeg y sus codecs pueden tener consideraciones de licencia propias según distribución/uso.
