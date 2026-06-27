# FEASIBILITY — Fase 0

PRISMA+ v5.2 — Viabilidad + decisión de stack

## Proyecto
Audio WAV Clínico — conversor local minimalista de MP3/OGG a WAV para médicos e investigadores.

## 0.1 Viabilidad en navegador

### Conclusión corta
El proyecto es viable en navegador si el procesamiento real de audio se ejecuta en Web Worker y se usa un motor robusto de conversión como FFmpeg.wasm.

No se recomienda depender únicamente de APIs nativas de decodificación de audio, porque el soporte de formatos y la disponibilidad en Workers no es suficientemente robusta para el objetivo del producto.

### APIs necesarias

| API / capacidad | Uso | Viabilidad | Fuente de compatibilidad |
|---|---|---:|---|
| File API | Leer archivos seleccionados por el usuario | Alta | https://caniuse.com/fileapi |
| Blob URLs | Crear enlaces de descarga del WAV generado | Alta | https://caniuse.com/bloburls |
| Web Workers | Ejecutar conversión fuera del hilo principal | Alta | https://caniuse.com/webworkers |
| WebAssembly | Ejecutar FFmpeg.wasm | Alta en navegadores modernos | https://caniuse.com/wasm |
| ES Modules | Modularizar JS vanilla | Alta en navegadores modernos | https://caniuse.com/es6-module |

### Nota sobre SharedArrayBuffer
No se toma como requisito para el MVP.

SharedArrayBuffer requiere aislamiento cross-origin mediante cabeceras COOP/COEP en muchos navegadores modernos, lo cual complica el hosting estático simple. Para mantener la app minimalista y portable, el MVP debe usar una variante single-thread de FFmpeg.wasm si está disponible.

Fuente: https://caniuse.com/sharedarraybuffer

## Límites de memoria para este caso

La conversión de audio comprimido a WAV puede multiplicar mucho el tamaño del archivo.

Fórmula aproximada del WAV PCM 16-bit:

```text
segundos × sampleRate × canales × 2 bytes
```

Ejemplos aproximados:

| Duración | Parámetros | WAV aproximado |
|---:|---|---:|
| 1 min | 44.1 kHz, mono, 16-bit | ~5 MB |
| 1 min | 48 kHz, estéreo, 16-bit | ~11 MB |
| 10 min | 44.1 kHz, mono, 16-bit | ~53 MB |
| 10 min | 48 kHz, estéreo, 16-bit | ~115 MB |
| 30 min | 48 kHz, estéreo, 16-bit | ~346 MB |

Además del WAV final, FFmpeg.wasm puede mantener en memoria:

- archivo de entrada;
- sistema de archivos virtual;
- buffers temporales;
- memoria WebAssembly;
- archivo de salida antes de descarga.

### Estimación defensiva inicial
Para el MVP:

```text
memoria_estimada = max(file.size × 12, wav_estimado × 3, 256 MB)
```

Criterio recomendado:

- Si `performance.memory.jsHeapSizeLimit` está disponible: no iniciar si `memoria_estimada > 60%` del límite.
- Si no está disponible: aplicar límite conservador por archivo y duración.
- Una sola conversión activa a la vez.

### Límites recomendados MVP

| Límite | Valor inicial | Motivo |
|---|---:|---|
| Conversiones simultáneas | 1 | Evita confusión y picos de memoria |
| Tamaño máximo inicial si no hay memoria disponible | 50 MB | Conservador para navegadores comunes |
| Duración máxima sugerida tras metadatos | 30 min | Evita WAVs enormes en equipos modestos |
| Multiplicador defensivo | 12× entrada o 3× WAV | Compensa overhead de WASM y buffers |

Estos límites se deben presentar al usuario con lenguaje no técnico, por ejemplo:

> “Este archivo es demasiado grande para procesarlo de forma segura en este navegador.”

## 0.2 Decisión de stack

### Build step

```text
[x] Sin build — porque:
    - El MVP es de una sola pantalla.
    - Se prioriza portabilidad y simplicidad.
    - El runtime final debe ser estático y legible.
    - Evita que médicos/investigadores dependan de instalación Node para usar la app.

[ ] Vite — porque:
    - No es necesario por ahora.
    - Se reservaría para una fase futura si crecen mucho los módulos,
      tests o empaquetado de assets.
```

### ESLint / Prettier

```text
[ ] Sí — no se activa en MVP para mantener cero tooling obligatorio.

[x] No — porque:
    - Se prioriza minimalismo del repositorio.
    - No habrá build step.
    - La calidad se controlará con módulos pequeños, contratos y revisión PRISMA+.
```

Nota: ESLint/Prettier pueden añadirse después como devDependencies sin afectar el runtime.

## 0.3 Tabla de riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| Archivo demasiado grande congela o agota memoria | Media | Alto | Worker obligatorio, preflight de tamaño/memoria, una conversión activa, cancelación |
| FFmpeg.wasm aumenta peso inicial de la app | Alta | Medio | Carga diferida al iniciar conversión, estado “preparando conversor”, assets locales |
| Navegador antiguo sin WebAssembly/Workers | Baja-Media | Alto | Detección de compatibilidad antes de permitir uso |
| Progreso exacto no siempre disponible | Media | Medio | Mostrar progreso si FFmpeg lo reporta; si no, indicador de actividad y mensajes claros |
| Cancelación no instantánea | Media | Medio | Protocolo de cancelación y terminación segura del Worker si es necesario |
| Usuario carga .pm3 por error | Media | Bajo | Mensaje específico sugiriendo revisar si era .mp3 |
| Uso con datos clínicos sensibles | Alta | Alto | Privacidad local visible, sin subida de audio, sin telemetría |
| Hosting sin cabeceras COOP/COEP | Media | Medio | Evitar dependencia de SharedArrayBuffer/multithread en MVP |
| Resultado WAV muy grande | Media | Medio-Alto | Estimar salida, advertir, permitir descarga clara, liberar URLs al limpiar |
| Safari/iOS con memoria limitada | Media | Alto | Límites conservadores, mensajes de incompatibilidad/tamaño, una tarea activa |

## 0.4 Arquitectura de procesamiento

### Opción A: FFmpeg.wasm en Web Worker

Enfoque:
- La UI solo gestiona interacción y estados.
- Un módulo Core valida archivo y orquesta mensajes.
- Un Web Worker carga FFmpeg.wasm, convierte a WAV y reporta progreso.

Ventajas:
- Soporte robusto para MP3 y OGG.
- Cumple R4: audio siempre en Worker.
- Evita bloquear el hilo principal.
- Misma estrategia para futuros formatos.
- No requiere backend.

Desventajas:
- Mayor peso inicial o diferido.
- Mayor consumo de memoria que soluciones nativas simples.
- Cancelación puede requerir terminar/recrear Worker.
- Requiere manejar cuidadosamente assets WASM.

### Opción B: Web Audio API / decodificación nativa + encoder WAV manual

Enfoque:
- Decodificar audio con APIs del navegador y construir WAV con JS.

Ventajas:
- Menos peso que FFmpeg.wasm.
- No necesita motor WASM externo.
- WAV encoder manual es relativamente simple.

Desventajas:
- Soporte de OGG/MP3 depende del navegador.
- Decodificación nativa no es suficientemente portable en Worker para este caso.
- Riesgo de violar R4 si se decodifica en main thread.
- Menos control sobre errores por formato.

### Recomendación

Recomendada: Opción A — FFmpeg.wasm en Web Worker.

Justificación:
- El requisito principal es que el navegador no se cuelgue.
- El público objetivo necesita robustez, no controles técnicos.
- MP3/OGG a WAV es una conversión de formato real; FFmpeg.wasm reduce incertidumbre.
- Se mantiene privacidad local y runtime vanilla.

## 0.5 CDNs necesarias

Decisión MVP:

```text
Ninguna CDN obligatoria en producción.
```

Se recomienda incluir los assets de FFmpeg.wasm localmente en el proyecto para evitar dependencias de red durante el uso normal.

Razones:
- Mejor privacidad percibida en contexto clínico/académico.
- Menos fallos por red institucional, proxies o firewalls.
- Cumple mejor R8: procesamiento local y sin red por defecto.

Nota:
- FFmpeg.wasm es una tecnología pre-aprobada por PRISMA+ para procesamiento audio/video.
- Si en una fase futura se decide usar CDN para prototipo rápido, debe documentarse explícitamente en `docs/ARCHITECTURE.md`.

## 0.6 Puntos de decisión futura

1. Límite real de duración/tamaño tras pruebas en navegadores objetivo.
2. Si se permite lote de varios archivos o se mantiene uno a la vez.
3. Si se añade una advertencia clínica/legal sobre manejo de datos sensibles.
4. Si se añade modo offline/PWA.
5. Si se activa ESLint/Prettier cuando el código crezca.
6. Si se empaquetan assets FFmpeg localmente o se usa CDN documentada.
7. Si se ofrece salida WAV mono para reducir tamaño en audios de voz, solo si el usuario lo pide.

## Decisión final de Fase 0

- Runtime: Vanilla HTML5 + CSS3 + JS ES2022+ Modules.
- Build step: No.
- Tooling obligatorio: No.
- Procesamiento: FFmpeg.wasm single-thread en Web Worker.
- CDN: Ninguna obligatoria; assets locales recomendados.
- UX técnica: una conversión activa, progreso/cancelación y mensajes no técnicos.
