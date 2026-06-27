# GitHub Publishing Guide — APU-01.1

PRISMA+ v5.2 — Guía de publicación

## 1. Estado del repositorio

Este repositorio está preparado para publicarse como app estática:

```text
APU-01 — Preparación Acústica
APU-01.1 — Modo Preparar para transcripción
```

Stack:

```text
HTML5 + CSS3 + Vanilla JS ES2022+ Modules
Sin framework runtime
Sin build step
FFmpeg.wasm local
Web Worker obligatorio
```

## 2. Antes de subir

Ejecutar:

```bash
npm test
```

Debe mostrar:

```text
Core smoke tests: OK
Static audit: OK
```

Luego probar manualmente:

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

Probar:
- `.txt` → error.
- `.pm3` → sugerencia.
- MP3/OGG/WAV en modo estándar.
- MP3/OGG/WAV en modo transcripción.
- Descarga WAV preparado.
- Descarga manifest JSON.
- Cancelación.
- Sin red externa en DevTools.

## 3. Inicializar Git

```bash
git init
git add .
git commit -m "Release APU-01.1 acoustic preparation for transcription"
git branch -M main
```

## 4. Crear repositorio remoto

En GitHub:

1. Crear nuevo repositorio.
2. No añadir README desde GitHub porque ya existe.
3. Copiar URL del repositorio.

Luego:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 5. Activar GitHub Pages

En GitHub:

```text
Settings → Pages → Build and deployment
```

Elegir:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Guardar y esperar la URL publicada.

## 6. Probar GitHub Pages

En la URL publicada:

1. Abrir la app.
2. Probar ambos modos.
3. Confirmar que `ffmpeg-core.wasm` carga correctamente.
4. Confirmar que no hay red externa diferente al dominio de GitHub Pages.

## 7. Consideraciones por FFmpeg.wasm

El repositorio incluye assets locales de FFmpeg.wasm:

```text
assets/vendor/ffmpeg
```

Tamaño aproximado:

```text
31 MB
```

No eliminar esa carpeta si se quiere que la app funcione sin CDN.

## 8. Licencia pendiente

Antes de publicar como software abierto, decidir licencia.

Opciones comunes:

| Licencia | Uso típico |
|---|---|
| MIT | Simple, permisiva |
| Apache-2.0 | Permisiva con cláusula de patentes |
| GPL-3.0 | Copyleft fuerte |
| Sin licencia | Todos los derechos reservados por defecto |

Recomendación práctica:
- Si quieres permitir reutilización amplia: MIT.
- Si quieres una opción permisiva más formal: Apache-2.0.

Nota:
- Revisar también condiciones de FFmpeg/FFmpeg.wasm según distribución y uso final.

## 9. Release sugerido

Tag sugerido:

```bash
git tag -a v0.6.0 -m "APU-01.1 acoustic preparation for transcription"
git push origin v0.6.0
```

Release title:

```text
APU-01.1 — Acoustic preparation for transcription
```

Resumen:

```text
Local browser app for MP3/OGG/WAV to WAV standard or transcription-ready WAV.
Includes Web Worker processing, FFmpeg.wasm local assets, progress, cancellation, and JSON manifest.
```
