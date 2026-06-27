# APU-01.1 SCOPE — Modo Preparar para transcripción

PRISMA+ v5.2 — Fase -1 de iteración APU-01.1

## Nombre de iteración

```text
APU-01.1 — Modo Preparar para transcripción
```

## App base

```text
APU-01 — Preparación Acústica
Audio WAV Clínico
```

## Objetivo

Añadir a la app actual un modo opcional para preparar grabaciones clínicas o cualitativas para transcripción automática.

El usuario podrá elegir entre:

```text
1. WAV estándar
2. WAV para transcripción
```

El modo nuevo debe generar audio estandarizado:

```text
WAV mono, 16 kHz, 16-bit PCM
```

## Core de la iteración

Convertir o preparar archivos de audio comunes para que sistemas de transcripción automática, como Whisper u otros ASR, trabajen con entradas más consistentes.

## Entrada

La app debe aceptar:

- `.mp3`
- `.ogg`
- `.wav`

## Salidas

### Modo WAV estándar

Salida actual:

```text
[base].wav
```

Objetivo:
- Compatibilidad general.
- Conversión simple.
- Sin prometer optimización para ASR.

### Modo WAV para transcripción

Nueva salida:

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

Salida complementaria recomendada:

```text
[base]_manifest.json
```

## Procesamiento recomendado

Pipeline conservador:

```text
1. Validación defensiva de archivo
2. Estimación de memoria
3. Conversión a mono
4. Resampleo a 16 kHz
5. Salida PCM 16-bit
6. Filtro pasa-altos suave para vibraciones graves
7. Normalización conservadora de volumen
8. Reducción moderada de ruido si no daña voz
9. Exportación WAV preparado
10. Manifest JSON
```

## Principio clave

La app debe mejorar compatibilidad y consistencia, no prometer limpieza perfecta.

Lenguaje recomendado:

```text
Prepara el audio para transcripción automática.
```

Evitar promesas como:

```text
Elimina totalmente el ruido.
Elimina el eco.
Separa entrevistador y entrevistado.
Garantiza mejor transcripción.
```

## Alcance incluido

- Añadir opción de modo de salida.
- Aceptar WAV como entrada.
- Generar WAV preparado para ASR.
- Mantener procesamiento en Worker.
- Mantener progreso y cancelación.
- Mantener privacidad local.
- Generar manifest JSON básico.
- Documentar filtros usados.
- Mantener UI simple para usuarios no técnicos.

## Alcance excluido

No se implementará en APU-01.1:

- Transcripción automática.
- Separación de hablantes.
- Diarización.
- Separación real de entrevistador/entrevistado.
- Análisis cualitativo.
- Resúmenes con IA.
- Diagnóstico o interpretación clínica.
- Eliminación agresiva de silencios.

## Supuestos

1. El modo “WAV estándar” debe seguir existiendo.
2. El nuevo modo será opcional y visible como recomendación para transcripción.
3. El procesamiento seguirá usando FFmpeg.wasm local en Worker.
4. Se prioriza robustez y preservación de voz sobre limpieza agresiva.
5. El manifest JSON será descargable junto al WAV preparado.

## Preguntas no bloqueantes

- ¿Debe el modo “WAV para transcripción” ser el modo seleccionado por defecto?
- ¿Quieres que el manifest se descargue automáticamente o mediante botón separado?
- ¿Deseas una nota visible recomendando conservar siempre el audio original?

## Decisión recomendada inicial

Para médicos e investigadores no técnicos:

```text
Modo por defecto recomendado: WAV para transcripción
Modo alternativo: WAV estándar
```

Con texto claro:

```text
Recomendado para entrevistas, grupos focales y transcripción automática.
```
