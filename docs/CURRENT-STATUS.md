# CURRENT STATUS — APU-01

PRISMA+ v5.2

## Estado actual

```text
APU-01 v0.7.0 estable.
Lista para auditoría, descarga, GitHub Actions y despliegue Netlify.
Licencia MIT aplicada.
```

## Identidad

```text
APU-01 — Preparación Acústica
Unidad inicial del ecosistema APU
```

## Stack

```text
Runtime: HTML5 + CSS3 + Vanilla JS ES2022+ Modules
Build step: No
Frameworks runtime: No
Procesamiento principal: Web Worker + FFmpeg.wasm local
Fallback local: Web Audio API
Servidor local recomendado: node serve.mjs 8080
CDN obligatoria: Ninguna
Backend: Ninguno
Telemetría: Ninguna
Licencia: MIT
```

## Protocolo

```text
Protocol Version: 1.2.0
```

## Estado funcional

La app puede:
1. Validar navegador, formato, tamaño y memoria.
2. Aceptar audios comunes: MP3, WAV, M4A/AAC, MP4, OGG/OPUS, WEBM y FLAC.
3. Convertir a WAV estándar.
4. Preparar WAV para transcripción: mono, 16 kHz, 16-bit PCM.
5. Usar fallback local con Web Audio API si FFmpeg.wasm no decodifica un archivo compatible con el navegador.
6. Generar manifest JSON en modo transcripción.
7. Mostrar progreso/estado y permitir cancelación.
8. Descargar WAV y manifest.
9. Mantener procesamiento local sin subida de audio ni red externa.

## Verificación final

```text
npm test: OK
GitHub Actions: OK
Netlify deploy: OK
Conversión WAV: OK
Conversión AAC con fallback local: OK
Licencia MIT: OK
```

## Archivos de despliegue profesional

```text
netlify.toml
manifest.json
robots.txt
404.html
serve.mjs
LICENSE
```

## Próximo paso del ecosistema

APU-02 debe mantenerse como unidad separada. No implementar APU-02 dentro de APU-01.
