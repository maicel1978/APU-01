# QA REPORT — Audio WAV Clínico / APU-01.1

PRISMA+ v5.2 — Fase 5 APU-01.1

## 1. Resumen

Estado: APU-01.1 funcional y preparado para revisión manual final.

Implementado:
- Entrada MP3/OGG/WAV.
- Modo `standard-wav`.
- Modo `transcription-prep`.
- Protocolo Worker `1.2.0`.
- Manifest JSON para audio preparado.
- Progreso y cancelación.
- Procesamiento local sin red externa.

Limitación:
- No se pudo automatizar conversión real en navegador porque el entorno no incluye navegador headless disponible.
- La conversión real debe probarse manualmente con audios reales.

## 2. Comandos ejecutados

```bash
npm test
node --check src/workers/audio-conversion.worker.js
node --check src/core/conversion-controller.js
node --check src/ui/app.js
python3 -m http.server 8765
```

Resultado:
- Core smoke tests: OK.
- Static audit: OK.
- Sintaxis JS: OK.
- Assets principales: HTTP 200.

## 3. Cobertura automatizada

| Caso | Estado |
|---|---:|
| `.mp3` válido | OK |
| `.ogg` válido | OK |
| `.wav` válido | OK |
| `.pm3` | OK |
| `.txt` | OK |
| archivo vacío | OK |
| archivo grande | OK |
| perfiles de procesamiento | OK |
| manifest JSON | OK |
| protocolo 1.2.0 | OK |
| R1 sin frameworks | OK |
| R10 límite de líneas | OK |
| R14 cabecera JS | OK |

## 4. Assets verificados

Por HTTP local:

```text
index.html                                      200
src/workers/audio-conversion.worker.js          200
assets/vendor/ffmpeg/core/ffmpeg-core.wasm      200
```

## 5. Revisión APU-01.1

| Criterio | Estado | Evidencia |
|---|---:|---|
| Selector de modo | Cumple | UI con dos opciones |
| Modo recomendado claro | Cumple | `WAV para transcripción` preseleccionado |
| Entrada WAV | Cumple | Core acepta `.wav` |
| Entradas MP3/OGG | Cumple | Conservadas |
| WAV estándar | Cumple | Pipeline estándar Worker |
| WAV para transcripción | Cumple | Pipeline mono 16 kHz 16-bit |
| Sufijo `_prepared.wav` | Cumple | Core resuelve nombre |
| Manifest JSON | Cumple | Core genera y UI descarga |
| No sobrescribir original | Cumple | Descarga derivada |
| Worker obligatorio | Cumple | Audio en Worker |
| Progreso | Cumple | `PROGRESS` |
| Cancelación | Cumple | `CANCEL` / `CANCELLED` |
| Privacidad local | Cumple | Sin CDN obligatoria |
| Mensajes prudentes | Cumple | No promete milagros |
| Accesibilidad mínima | Cumple | Controles nativos + `aria-live` |
| Runtime vanilla | Cumple | Sin frameworks |

## 6. Smoke test manual obligatorio

1. Ejecutar:

```bash
python3 -m http.server 8080
```

2. Abrir:

```text
http://localhost:8080
```

3. Probar modo `WAV estándar`:
- Cargar MP3 pequeño.
- Convertir.
- Descargar WAV.
- Repetir con OGG o WAV si hay muestra.

4. Probar modo `WAV para transcripción`:
- Cargar MP3/OGG/WAV pequeño.
- Procesar.
- Descargar WAV preparado.
- Descargar manifest JSON.
- Confirmar que manifest declara `channels: 1`, `sampleRate: 16000`, `bitDepth: 16`.

5. Probar cancelación:
- Iniciar procesamiento.
- Pulsar Cancelar.
- Confirmar que la UI permite intentarlo de nuevo.

6. Verificar red:
- DevTools → Network.
- Deben cargarse solo archivos del mismo origen local.

## 7. Riesgos residuales

| Riesgo | Nivel | Mitigación |
|---|---:|---|
| Safari/iOS puede fallar por memoria | Medio | Límites conservadores |
| Conversión real no automatizada aquí | Medio | Smoke manual obligatorio |
| Filtros no ayudan en audio muy degradado | Medio | Lenguaje prudente |
| Assets locales pesan ~31 MB | Bajo-Medio | Privacidad y uso sin CDN |
| UI cerca de R10 | Bajo | No ampliar `app.js` sin dividir |

## 8. Conclusión QA

APU-01.1 queda listo para prueba manual final y publicación. No hay bugs abiertos detectados por auditoría automatizada.
