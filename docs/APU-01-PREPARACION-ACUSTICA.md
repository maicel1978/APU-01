# APU-01 — Preparación Acústica

PRISMA+ v5.2 — Definición de unidad

## 1. Identidad

Esta aplicación representa la primera unidad del ecosistema APU:

```text
APU-01 — Preparación Acústica
```

Nombre de producto actual:

```text
Audio WAV Clínico
```

Propósito:

```text
Convertir y preparar grabaciones clínicas/cualitativas para transcripción automática y procesamiento posterior.
```

## 2. Usuarios objetivo

- Médicos.
- Investigadores cualitativos.
- Equipos clínicos.
- Personal académico.
- Usuarios sin conocimientos técnicos avanzados.

## 3. Alcance actual

La app actual:
- Recibe MP3/OGG.
- Convierte a WAV.
- Procesa en Web Worker.
- Permite progreso y cancelación.
- Mantiene privacidad local.
- Usa FFmpeg.wasm local.

## 4. Alcance recomendado para la siguiente iteración

Añadir un modo opcional:

```text
Preparar para transcripción
```

Entrada:
- MP3.
- OGG.
- WAV.

Salida:

```text
WAV mono, 16 kHz, 16-bit, PCM
```

Salida complementaria recomendada:

```text
manifest.json
```

## 5. Procesamiento recomendado

Pipeline conservador:

```text
1. Validar formato/tamaño/memoria
2. Convertir a mono
3. Resamplear a 16 kHz
4. Convertir a PCM 16-bit
5. Aplicar filtro pasa-altos suave
6. Aplicar reducción moderada de ruido
7. Normalizar volumen de forma conservadora
8. Exportar WAV preparado
9. Generar manifest
```

## 6. Sobre silencios

En investigación cualitativa, los silencios pueden ser significativos.

Por tanto:
- No eliminar silencios agresivamente por defecto.
- Preservar pausas importantes.
- Si se implementa reducción de silencios, debe ser opcional o conservadora.

Mensaje recomendado:

```text
Conserva siempre el archivo original. El audio preparado está pensado para facilitar la transcripción automática.
```

## 7. Sobre entrevistador / entrevistado

APU-01 no debe separar entrevistador y entrevistado.

Razón:
- La separación real de voces es técnicamente compleja.
- Puede fallar en grabaciones mono, ruidosas o con voces solapadas.
- Requiere revisión humana.

APU-01 debe preparar el audio para que una unidad posterior pueda diarizar mejor.

Unidad recomendada:

```text
APU-03 — Diarización / Hablantes
```

## 8. Qué NO debe hacer esta unidad

APU-01 no debe:
- Transcribir.
- Diarizar.
- Separar pistas de voces.
- Analizar contenido.
- Generar códigos cualitativos.
- Resumir entrevistas.
- Producir conclusiones clínicas.

## 9. Valor dentro del ecosistema

APU-01 crea un insumo confiable para:
- Transcripción automática.
- Diarización.
- Limpieza textual.
- Análisis cualitativo asistido por IA.
- Exportación académica.

## 10. Criterio de éxito

La unidad cumple su función si produce un archivo:

```text
Legible, estándar, privado, trazable y adecuado para transcripción automática.
```
