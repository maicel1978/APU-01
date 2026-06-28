# Audio WAV Clínico — APU-01

Herramienta local y privada de **preparación acústica** para médicos, investigadores y equipos académicos que trabajan con entrevistas, grupos focales o grabaciones clínicas/cualitativas.

Esta app es la primera unidad del ecosistema APU:

```text
APU-01 — Preparación Acústica
```

Procesa audio en el navegador con **Vanilla JS**, **Web Worker** y **FFmpeg.wasm local**. Ningún archivo se sube a servidores.

## Qué hace

La app ofrece dos modos:

| Modo | Uso | Salida |
|---|---|---|
| WAV para transcripción | Recomendado para entrevistas, grupos focales y ASR/Whisper | WAV mono, 16 kHz, 16-bit + manifest JSON |
| WAV estándar | Conversión simple para compatibilidad general | WAV PCM |

Formatos de entrada:

```text
MP3, WAV, M4A/AAC, MP4, OGG/OPUS, WEBM, FLAC
```

## Características

- Procesamiento 100% local.
- Sin CDN obligatoria.
- Sin telemetría.
- Sin frameworks runtime.
- Web Worker para evitar bloquear la interfaz.
- Progreso visible y cancelación.
- Validación defensiva de formato, tamaño y memoria.
- Descarga de WAV preparado.
- Descarga de manifest JSON en modo transcripción.
- Interfaz simple para usuarios no técnicos.

## Flujo rápido

1. Elige modo:
   - **WAV para transcripción**.
   - **WAV estándar**.
2. Arrastra o selecciona un archivo de audio compatible.
3. Pulsa el botón principal.
4. Espera el progreso o cancela si lo necesitas.
5. Descarga el WAV.
6. Si usaste modo transcripción, descarga también el manifest JSON.

## Modo WAV para transcripción

Este modo genera un archivo preparado para sistemas de transcripción automática.

Salida:

```text
[base]_prepared.wav
```

Formato:

```text
WAV
PCM signed 16-bit little-endian
Mono
16 kHz
16-bit
```

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

No promete eliminar completamente ruido, eco ni separar hablantes. La app prepara el audio de forma conservadora para mejorar consistencia y compatibilidad.

## Manifest JSON

En modo transcripción, la app genera un archivo:

```text
[base]_prepared_manifest.json
```

Incluye:

- archivo fuente;
- archivo generado;
- formato de salida;
- canales, frecuencia y bit depth;
- procesamiento aplicado;
- privacidad local.

## 🚀 Inicio Rápido (Windows)

**La forma más fácil de empezar:**

1. Descarga y descomprime el repositorio.
2. Haz **doble clic** en `INICIAME.bat`.
3. Se abrirá automáticamente tu navegador en `http://localhost:8080`.

El servidor incluye automáticamente los headers de seguridad necesarios (`COOP` + `COEP`).

**Otras opciones:**
- `INICIAME.ps1` → Para PowerShell
- `serve.py` → Para Python
- `start.bat` → Alternativa simple

---

## Ejecución local

No se recomienda abrir `index.html` con `file://`, porque Web Workers, ES Modules y WebAssembly pueden fallar.

Desde la raíz del repositorio:

```bash
npm start
```

Abrir:

```text
http://localhost:8080
```

También puedes usar:

```bash
npm start
```

El comando `npm start` usa `serve.mjs` con Node.js, por lo que funciona igual en Windows, macOS y Linux. Este servidor activa los headers `COOP` + `COEP` requeridos por el ecosistema APU. Si prefieres Python, puedes usar `npm run start:python` o `python serve.py 8080`. El servidor simple `python -m http.server 8080` queda reservado solo para revisiones estáticas rápidas porque no añade esos headers.

## Tests y auditoría

Requiere Node.js 18 o superior.

```bash
npm test
```

Equivale a:

```bash
node tests/core-smoke.mjs
node tests/static-audit.mjs
```

Los tests verifican:

- Validación de MP3, WAV, M4A/AAC, MP4, OGG/OPUS, WEBM, FLAC, PM3, archivos vacíos y formatos inválidos.
- Estimación defensiva de memoria.
- Perfiles `standard-wav` y `transcription-prep`.
- Manifest JSON.
- Reglas PRISMA+ críticas.
- Ausencia de frameworks runtime.
- Protocolo Worker `1.2.0`.

## Arquitectura

```text
UI → Core → MessageChannel → Worker → FFmpeg.wasm
```

| Capa | Responsabilidad |
|---|---|
| `src/ui` | DOM, eventos, estados visuales y accesibilidad |
| `src/core` | Validación, memoria, perfiles, manifest y orquestación |
| `src/workers` | Conversión pesada de audio en segundo plano |
| `assets/vendor/ffmpeg` | FFmpeg.wasm local |
| `tests` | Smoke tests y auditoría estática |
| `docs` | Contratos, arquitectura y QA |

Documentación técnica:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/API-CONTRACTS.md`](docs/API-CONTRACTS.md)
- [`docs/API-CONTRACTS-WORKER.md`](docs/API-CONTRACTS-WORKER.md)
- [`docs/APU-01-1-MANIFEST-SCHEMA.md`](docs/APU-01-1-MANIFEST-SCHEMA.md)

## Rol dentro del ecosistema APU

```text
APU-01 Preparación Acústica
  ↓
APU-02 Transcripción
  ↓
APU-03 Diarización / Hablantes
  ↓
APU-04 Limpieza textual
  ↓
APU-05 Análisis cualitativo asistido por IA
  ↓
APU-06 Exportación
```

Esta app **no transcribe, no separa hablantes y no analiza contenido**. Produce audio preparado para que otras unidades puedan trabajar mejor.

Documentos del ecosistema:

- [`docs/APU-ECOSYSTEM.md`](docs/APU-ECOSYSTEM.md)
- [`docs/APU-01-PREPARACION-ACUSTICA.md`](docs/APU-01-PREPARACION-ACUSTICA.md)
- [`docs/APU-COMMON-STANDARDS.md`](docs/APU-COMMON-STANDARDS.md)
- [`docs/DATA-CONTRACTS.md`](docs/DATA-CONTRACTS.md)
- [`docs/APU-ROADMAP.md`](docs/APU-ROADMAP.md)

## Privacidad

El audio se procesa localmente en el navegador.

La app no incluye:

- subida de archivos a servidores;
- telemetría;
- analíticas;
- CDN obligatoria.

Para verificarlo, abre DevTools → Network durante una conversión. Deben cargarse solo archivos del mismo origen donde serviste la app.

## Limitaciones conocidas

- Se procesa un archivo a la vez.
- Archivos grandes pueden rechazarse preventivamente.
- Safari/iOS puede tener límites de memoria más estrictos.
- FFmpeg.wasm local añade aproximadamente 31 MB al repositorio.
- La conversión real debe probarse en navegadores objetivo con audios reales.
- La preparación acústica no sustituye revisión humana ni mejora audios extremadamente degradados.


## Subida fácil a GitHub en Windows

Si descargaste el paquete corregido sin carpeta `.git`, puedes usar el asistente incluido:

Opción más simple: doble clic en:

```text
SUBIR_A_GITHUB.bat
```

O desde PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\SUBIR_A_GITHUB.ps1
```

El asistente clona el repositorio oficial en una carpeta vecina, copia encima los archivos corregidos, ejecuta `npm test`, crea el commit y hace `git push`.

## Despliegue en Netlify (recomendado)

Esta aplicación es 100% estática y está lista para desplegarse en **Netlify** de forma limpia y profesional.

### Pasos para desplegar en Netlify

1. Conecta el repositorio en Netlify (o arrastra la carpeta).
2. Netlify detectará automáticamente `netlify.toml`.
3. **No requiere build command** (es una app estática pura).
4. Publica desde la raíz (`/`).

### Configuración aplicada (`netlify.toml`)

- **Headers críticos** para `SharedArrayBuffer` y FFmpeg.wasm (`COOP` + `COEP`).
- Seguridad reforzada (CSP, XSS, Referrer, Permissions-Policy).
- Cache agresivo para FFmpeg.wasm (~31 MB) e inmutable.
- Headers de privacidad y seguridad alineados con el ecosistema APU.
- 404 personalizado y redirecciones.

### Archivos adicionales para despliegue profesional

- `404.html` — Página de error personalizada.
- `manifest.json` — PWA-ready (compatible con ecosistema APU).
- `robots.txt` — Protección de privacidad.

### Pruebas post-deploy

1. Abre la URL de Netlify.
2. Prueba ambos modos.
3. Confirma en DevTools → Network que:
   - Solo se cargan assets del mismo dominio.
   - `ffmpeg-core.wasm` carga correctamente.
   - `crossOriginIsolated` es `true` (recomendado).
4. Prueba conversión de un archivo real.

### Alternativa: GitHub Pages

También funciona con GitHub Pages (ver `docs/GITHUB-PUBLISHING.md`).

## Publicación en GitHub Pages (alternativa)

## Licencia

Este proyecto está bajo la **Licencia MIT**. Esto significa que puedes usar, copiar, modificar y distribuir el software libremente, siempre que se mantenga el aviso de copyright original.

Consulta el archivo [LICENSE](LICENSE) para ver el texto legal completo.

> ⚠️ **Nota sobre dependencias:** Este proyecto incluye y distribuye binarios locales de `FFmpeg.wasm` en la carpeta `assets/vendor/ffmpeg`. FFmpeg está licenciado bajo **LGPLv2.1+** (o GPL según los flags de compilación). El uso y distribución de este ecosistema respeta la naturaleza de código abierto de dichas herramientas.
