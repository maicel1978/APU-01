# CURRENT STATUS — Audio WAV Clínico / APU-01.1

PRISMA+ v5.2

## Estado actual

```text
APU-01.1 completado y aprobado.
Documentación de publicación GitHub preparada.
Handoff para ecosistema APU preparado.
APU-02 queda listo para iniciar en otra sección/sesión.
```

## Identidad

```text
APU-01 — Preparación Acústica
APU-01.1 — Modo Preparar para transcripción
```

## Stack

```text
Runtime: HTML5 + CSS3 + Vanilla JS ES2022+ Modules
Build step: No
Frameworks runtime: No
Procesamiento: Web Worker obligatorio
Transporte: MessageChannel directo
Motor: FFmpeg.wasm single-thread local
CDN obligatoria: Ninguna
```

## Protocolo

```text
Protocol Version: 1.2.0
```

## Estado funcional

La app puede:
1. Validar navegador, formato, tamaño y memoria.
2. Aceptar `.mp3`, `.ogg` y `.wav`.
3. Convertir a WAV estándar.
4. Preparar WAV para transcripción: mono, 16 kHz, 16-bit PCM.
5. Generar manifest JSON.
6. Mostrar progreso/estado.
7. Cancelar conversión.
8. Descargar WAV y manifest.
9. Mantener procesamiento local sin red externa.

## Documentación de publicación

Añadido:
- `docs/GITHUB-PUBLISHING.md`.
- `docs/RELEASE-CHECKLIST.md`.

## Documentación de handoff

Añadido:
- `docs/APU-HANDOFF.md`.
- `docs/APU-02-STARTER.md`.

## Tests

```bash
npm test
```

Resultado última ejecución:

```text
Core smoke tests: OK
Static audit: OK
```

## Próximos caminos separados

### Publicar APU-01.1

Seguir:

```text
docs/GITHUB-PUBLISHING.md
docs/RELEASE-CHECKLIST.md
```

### Iniciar APU-02 en otra sección

Usar:

```text
docs/APU-HANDOFF.md
docs/APU-02-STARTER.md
```

No implementar APU-02 dentro de APU-01.

## Pendiente externo

- Elegir licencia.
- Añadir `LICENSE` antes de publicar como software abierto.
