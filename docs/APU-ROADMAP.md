# APU Roadmap

PRISMA+ v5.2 — Ruta de evolución del ecosistema

## 1. Estado actual

Completado:

```text
APU-01 base — Conversión local MP3/OGG → WAV
```

Implementado:
- UI minimalista.
- Validación defensiva.
- Web Worker.
- FFmpeg.wasm local.
- Progreso/cancelación.
- Descarga WAV.
- Documentación y tests.

## 2. Próxima iteración recomendada

```text
APU-01.1 — Modo Preparar para transcripción
```

Objetivo:
- Añadir opción simple para generar WAV optimizado para ASR.

Entrada:
- MP3.
- OGG.
- WAV.

Salida:
- WAV mono, 16 kHz, 16-bit.
- Manifest JSON.

UI recomendada:

```text
Modo de salida
○ WAV estándar
● WAV para transcripción
```

Texto recomendado:

```text
Recomendado para entrevistas, grupos focales y transcripción automática.
Genera WAV mono, 16 kHz, 16 bits.
```

## 3. Iteración posterior

```text
APU-02 — Transcripción
```

Decisiones pendientes:
- Modelo local o proveedor externo explícito.
- Idiomas soportados.
- Formatos de salida.
- Manejo de privacidad si se usa red.

Salida mínima:
- TXT.
- JSON con timestamps.
- VTT/SRT opcional.

## 4. Diarización

```text
APU-03 — Hablantes
```

Objetivo:
- Detectar turnos de habla.
- Permitir renombrar hablantes.
- Permitir corrección manual.

No prometer:
- Separación perfecta de entrevistador/entrevistado.
- Identificación infalible de voces.

## 5. Limpieza textual

```text
APU-04 — Texto limpio
```

Objetivo:
- Preparar transcripción para análisis.
- Corregir puntuación.
- Marcar inaudibles.
- Preservar timestamps.
- Opcional: anonimización.

## 6. Análisis cualitativo asistido

```text
APU-05 — QDA asistido por IA
```

Objetivo:
- Códigos.
- Temas.
- Citas.
- Memos.
- Resúmenes por caso.
- Comparaciones entre entrevistas.
- Análisis de grupos focales.
- Análisis de discurso.

Regla:
- La IA propone; el investigador valida.

## 7. Exportación

```text
APU-06 — Exportación
```

Formatos posibles:
- Markdown.
- CSV.
- JSON.
- DOCX.
- Paquetes para software QDA si se define.

## 8. Prioridad recomendada

Orden sugerido:

```text
1. APU-01.1 Preparar para transcripción
2. Manifest JSON
3. APU-02 Transcripción
4. APU-03 Hablantes con revisión manual
5. APU-04 Limpieza textual
6. APU-05 Análisis cualitativo
7. APU-06 Exportación
```

## 9. Regla de crecimiento

No convertir una unidad en una mega-app.

Cada unidad debe tener:
- Entrada clara.
- Salida clara.
- Contratos documentados.
- Riesgos explícitos.
- Revisión humana cuando corresponda.
