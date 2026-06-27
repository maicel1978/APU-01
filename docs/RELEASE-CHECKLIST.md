# Release Checklist — APU-01.1

PRISMA+ v5.2 — Checklist antes de publicar

## 1. Tests automáticos

Ejecutar:

```bash
npm test
```

Resultado esperado:

```text
Core smoke tests: OK
Static audit: OK
```

## 2. Servidor local

Ejecutar:

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080
```

## 3. Casos negativos

Probar:

- `.txt` → error de formato.
- `.pm3` → sugerencia de MP3.
- archivo vacío → error.
- archivo muy grande → rechazo preventivo si aplica.

## 4. Modo WAV estándar

Probar con archivo pequeño:

- MP3 → WAV.
- OGG → WAV si hay muestra.
- WAV → WAV si hay muestra.

Confirmar:
- descarga WAV;
- UI responde;
- cancelar funciona si se alcanza a cancelar.

## 5. Modo WAV para transcripción

Probar con archivo pequeño:

- MP3 → prepared WAV.
- OGG → prepared WAV si hay muestra.
- WAV → prepared WAV si hay muestra.

Confirmar descarga:

```text
[base]_prepared.wav
[base]_prepared_manifest.json
```

Abrir manifest y verificar:

```text
channels: 1
sampleRate: 16000
bitDepth: 16
processedLocally: true
networkUpload: false
```

## 6. Privacidad

En DevTools → Network:

- Confirmar que solo carga archivos del mismo origen.
- Confirmar que no hay llamadas a APIs externas.
- Confirmar que FFmpeg.wasm se carga desde `assets/vendor/ffmpeg`.

## 7. GitHub Pages

Después de publicar:

- Abrir URL de Pages.
- Repetir modo estándar.
- Repetir modo transcripción.
- Confirmar descarga manifest.
- Revisar consola del navegador.

## 8. Documentación

Revisar:

- `README.md`.
- `docs/GITHUB-PUBLISHING.md`.
- `docs/QA-REPORT.md`.
- `docs/APU-HANDOFF.md`.
- `docs/APU-02-STARTER.md`.

## 9. Licencia

Antes de publicar como software abierto:

- Elegir licencia.
- Añadir `LICENSE`.
- Actualizar sección de licencia en README si corresponde.

## 10. Release

Comandos sugeridos:

```bash
git tag -a v0.6.0 -m "APU-01.1 acoustic preparation for transcription"
git push origin v0.6.0
```
