# QA REPORT — APU-01 v0.7.0

PRISMA+ v5.2

## 1. Resumen

Estado: versión estable, auditada y lista para despliegue profesional en Netlify.

Implementado:
- Entrada de audios comunes: MP3, WAV, M4A/AAC, MP4, OGG/OPUS, WEBM y FLAC.
- Modo `standard-wav`.
- Modo `transcription-prep`.
- Protocolo Worker `1.2.0`.
- FFmpeg.wasm local en Web Worker.
- Fallback local con Web Audio API para mejorar compatibilidad.
- Manifest JSON para audio preparado.
- Progreso, cancelación y descarga local.
- Servidor local Node.js con COOP/COEP.
- Configuración Netlify con headers, CSP, caché y 404.
- Licencia MIT.

## 2. Comandos ejecutados

```bash
npm test
```

Resultado final:
- Core smoke tests: OK.
- DOM contract: OK.
- Static audit: OK.

## 3. Cobertura automatizada

| Caso | Estado |
|---|---:|
| `.mp3` válido | OK |
| `.ogg` válido | OK |
| `.wav` válido | OK |
| `.opus` válido | OK |
| `.m4a` válido | OK |
| `.webm` válido | OK |
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
| GitHub Actions v5 | OK |
| servidor Node local | OK |

## 4. Pruebas manuales reportadas

| Prueba | Estado |
|---|---:|
| Deploy Netlify | OK |
| Conversión WAV | OK |
| Conversión AAC con fallback local | OK |
| GitHub Actions | OK |
| App local con `npm start` | OK |

## 5. Revisión APU

| Criterio | Estado | Evidencia |
|---|---:|---|
| Local-first | Cumple | Sin backend ni subida de audio |
| Privacidad absoluta | Cumple | Sin telemetría, sin CDN obligatoria |
| Vanilla JS | Cumple | Sin frameworks runtime |
| Web Worker | Cumple | FFmpeg.wasm en Worker |
| Fallback local | Cumple | Web Audio API local |
| Netlify | Cumple | `netlify.toml` con headers críticos |
| Manifest APU | Cumple | JSON descargable en modo transcripción |
| Accesibilidad mínima | Cumple | Controles nativos + `aria-live` |
| Licencia abierta | Cumple | MIT |

## 6. Riesgos residuales

| Riesgo | Nivel | Mitigación |
|---|---:|---|
| Algunos AAC/M4A específicos pueden no ser decodificados por FFmpeg ni por el navegador | Medio | Mensaje claro, conservar original, probar Chrome |
| Safari/iOS puede tener límites de memoria | Medio | Validación defensiva de memoria |
| Assets FFmpeg pesan ~31 MB | Bajo-Medio | Caché inmutable en Netlify |
| Firefox puede diferir en soporte AAC | Bajo-Medio | Fallback depende del navegador |

## 7. Conclusión QA

APU-01 v0.7.0 queda listo como release profesional: auditable, local-first, MIT, estático, desplegable en Netlify y compatible con el ecosistema APU.
