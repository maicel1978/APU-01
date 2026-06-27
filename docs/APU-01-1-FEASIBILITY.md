# APU-01.1 FEASIBILITY — Modo Preparar para transcripción

PRISMA+ v5.2 — Fase 0 de iteración APU-01.1

## 0.1 Viabilidad en navegador

### Conclusión

APU-01.1 es viable en navegador porque la app ya cuenta con:

- FFmpeg.wasm local.
- Web Worker real.
- MessageChannel.
- Progreso/cancelación.
- Validación defensiva.
- Descarga mediante Blob URL.

La iteración no requiere cambiar de stack. Requiere ampliar el comando de conversión y los contratos para soportar modos de salida.

### APIs necesarias

| API | Uso | Estado |
|---|---|---|
| File API | Leer MP3/OGG/WAV local | Ya usada |
| Blob URLs | Descargar WAV y manifest JSON | Ya usada parcialmente |
| Web Workers | Procesamiento pesado | Ya implementado |
| MessageChannel | Transporte Core↔Worker | Ya implementado |
| WebAssembly | FFmpeg.wasm | Ya implementado |
| ES Modules | Modularidad vanilla | Ya implementado |

### Soporte real

La compatibilidad ya fue evaluada en Fase 0 original con referencias Can I Use:

- File API: `https://caniuse.com/fileapi`
- Blob URLs: `https://caniuse.com/bloburls`
- Web Workers: `https://caniuse.com/webworkers`
- WebAssembly: `https://caniuse.com/wasm`
- ES Modules: `https://caniuse.com/es6-module`

No se añade dependencia de SharedArrayBuffer.

## Límites de memoria

El modo “WAV para transcripción” puede ser más eficiente en salida que WAV estándar porque genera mono 16 kHz, pero el procesamiento interno de FFmpeg.wasm sigue consumiendo memoria.

Mantener estimación defensiva:

```text
estimatedBytes = max(file.size × 12, 256 MB)
```

Mantener límites actuales:

- Si `performance.memory.jsHeapSizeLimit` existe: máximo 60% del heap.
- Si no existe: límite conservador de 50 MB de entrada.
- Una conversión activa a la vez.

### Tamaño estimado de salida preparada

WAV mono 16 kHz 16-bit:

```text
segundos × 16000 × 1 canal × 2 bytes
```

Ejemplos:

| Duración | WAV preparado aprox. |
|---:|---:|
| 10 min | ~19 MB |
| 30 min | ~58 MB |
| 60 min | ~115 MB |

Esto es razonable para entrevistas, pero archivos largos seguirán tardando y consumiendo memoria.

## 0.2 Decisión de stack

### Build step

```text
[x] Sin build — porque:
    - La app ya funciona como estática vanilla.
    - FFmpeg.wasm ya está local.
    - No se requiere bundling para nuevos modos.
    - Mantiene máxima portabilidad para GitHub Pages.

[ ] Vite — no necesario.
```

### ESLint / Prettier

```text
[ ] Sí — no se activa en esta iteración.
[x] No — se mantienen tests y auditoría estática existentes.
```

Nota:
- Los scripts `npm test` siguen sin dependencias.

## 0.3 Tabla de riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| Sobreprocesar voz y dañar consonantes | Media | Alto | Pipeline conservador, sin filtros agresivos |
| Ruido/eco muy fuerte no mejora | Alta | Medio | Mensajes honestos, no prometer milagros |
| Silencios significativos afectados | Media | Alto | No usar recorte agresivo de silencios por defecto |
| WAV de entrada muy largo | Media | Alto | Límites memoria, una tarea activa, cancelación |
| Manifest confunde al usuario | Baja | Bajo | Botón secundario y texto simple |
| Safari/iOS falla por memoria | Media | Alto | Límites conservadores y mensajes claros |
| Aumentar complejidad UX | Media | Medio | Dos modos simples, sin parámetros técnicos |
| Cambio de contratos incompleto | Baja | Alto | Versionar protocolo y actualizar docs antes de código |

## 0.4 Arquitectura de procesamiento

### Opción A — Dos modos con comandos FFmpeg separados

Enfoque:
- `standard-wav`: conversión actual.
- `transcription-prep`: nuevo pipeline FFmpeg.

Ventajas:
- Simple de entender.
- Mantiene comportamiento actual.
- Permite documentar filtros por modo.
- Menor riesgo de romper conversión estándar.

Desventajas:
- Duplica parte de la lógica Worker.
- Requiere contratos de modo.

### Opción B — Un único pipeline siempre optimizado

Enfoque:
- Toda salida se convierte a mono 16 kHz 16-bit.

Ventajas:
- UX muy simple.
- Salida consistente.

Desventajas:
- Rompe expectativa de WAV estándar.
- Usuarios que solo quieren conversión pierden fidelidad original.
- Mayor riesgo metodológico si se transforma todo sin elección.

### Opción C — Parámetros avanzados configurables

Enfoque:
- Permitir elegir filtros, intensidad, silencios, normalización.

Ventajas:
- Más control técnico.

Desventajas:
- Mala UX para usuarios no técnicos.
- Más riesgo de configuraciones dañinas.
- Mayor superficie de QA.

### Recomendación

Recomendada: Opción A.

```text
Dos modos simples:
- WAV estándar
- WAV para transcripción
```

Justificación:
- Preserva la app actual.
- Añade valor sin convertirla en herramienta técnica compleja.
- Evita imponer procesamiento a quien solo quiere conversión.

## Pipeline recomendado para modo transcripción

Comando conceptual FFmpeg:

```text
-i input
-vn
-ac 1
-ar 16000
-af highpass=f=80,dynaudnorm,acompressor
-acodec pcm_s16le
output_prepared.wav
```

### Decisiones conservadoras

Incluido en primera implementación:
- Mono.
- 16 kHz.
- PCM 16-bit.
- Pasa-altos suave.
- Normalización dinámica moderada.
- Compresión ligera.

No incluido por defecto:
- Eliminación agresiva de silencios.
- Dereverberación prometida.
- Separación de voces.
- Reducción de ruido agresiva.

Motivo:
- Preservar inteligibilidad y pausas relevantes.
- Evitar artefactos que dañen transcripción o análisis cualitativo.

## Manifest JSON

Decisión recomendada:

```text
Botón separado: Descargar manifest JSON
```

Motivo:
- Evita descargas inesperadas.
- Mantiene UX simple.
- Usuarios que no lo necesiten pueden ignorarlo.

El manifest debe generarse en Core/UI a partir del resultado de conversión y metadatos de modo.

## Modo por defecto

Decisión recomendada:

```text
WAV para transcripción como opción preseleccionada.
```

Motivo:
- La app queda definida como APU-01 Preparación Acústica.
- El público principal busca preparar entrevistas para ASR.
- El modo estándar seguirá disponible.

## 0.5 CDNs necesarias

```text
Ninguna.
```

FFmpeg.wasm sigue incluido localmente en:

```text
assets/vendor/ffmpeg
```

## 0.6 Puntos de decisión futura

1. Añadir intensidad de preparación: suave/normal, solo si hay demanda.
2. Evaluar reducción de ruido más avanzada tras pruebas con audios reales.
3. Añadir descarga empaquetada `.zip` para WAV + manifest si se acepta una dependencia o implementación propia.
4. Añadir análisis técnico del WAV generado si se necesita validar sample rate/canales en UI.
5. Definir APU-02 Transcripción como app separada.

## Decisión final Fase 0 APU-01.1

- Mantener vanilla puro.
- Mantener sin build step.
- Mantener FFmpeg.wasm local.
- Implementar dos modos simples.
- Modo recomendado por defecto: WAV para transcripción.
- Manifest JSON con botón separado.
- Pipeline conservador sin eliminación agresiva de silencios.
