# APU Ecosystem — Acoustic & Qualitative Research Pipeline

PRISMA+ v5.2 — Documentación de ecosistema

## 1. Visión

APU es un ecosistema modular de herramientas locales y privadas para investigación clínica y cualitativa basada en audio.

Objetivo general:

```text
Grabación de entrevista → audio preparado → transcripción → hablantes → texto limpio → análisis cualitativo → exportación
```

Principios:
- Privacidad por defecto.
- Procesamiento local siempre que sea posible.
- Herramientas simples para usuarios no técnicos.
- Módulos separados con contratos de datos claros.
- Trazabilidad entre audio, transcripción, códigos y resultados.
- Revisión humana en etapas interpretativas.

## 2. Unidad actual

Esta aplicación es la primera unidad del ecosistema:

```text
APU-01 — Preparación Acústica
```

Nombre actual del repositorio/app:

```text
Audio WAV Clínico
```

Rol:

```text
Preparar grabaciones de entrevistas para transcripción automática y procesamiento posterior.
```

## 3. Qué hace APU-01

APU-01 recibe audio bruto y genera un archivo WAV utilizable por herramientas posteriores.

Estado actual:
- Convierte MP3/OGG a WAV.
- Valida formato, tamaño y memoria.
- Procesa en Web Worker.
- Mantiene todo local.
- Permite progreso, cancelación y descarga.

Evolución recomendada:
- Añadir modo “Preparar para transcripción”.
- Aceptar WAV como entrada además de MP3/OGG.
- Generar WAV mono, 16 kHz, 16-bit.
- Aplicar mejora acústica conservadora.
- Generar `manifest.json` con metadatos de procesamiento.

## 4. Qué NO hace APU-01

APU-01 no debe asumir funciones de análisis o interpretación.

No hace:
- Transcripción automática.
- Diarización o identificación de hablantes.
- Separación real de voces.
- Resúmenes con IA.
- Codificación cualitativa.
- Análisis de discurso.
- Diagnóstico clínico.
- Interpretación de contenido.

Motivo:
- La preparación acústica es una etapa técnica.
- Transcribir, separar hablantes y analizar datos requiere otros contratos, controles y validación humana.

## 5. Pipeline propuesto

```text
APU-01 Preparación Acústica
  ↓
APU-02 Transcripción
  ↓
APU-03 Diarización / Hablantes
  ↓
APU-04 Limpieza y estructuración textual
  ↓
APU-05 Análisis cualitativo asistido por IA
  ↓
APU-06 Exportación académica / clínica
```

## 6. APU-02 — Transcripción

Entrada:
- WAV preparado.
- `manifest.json` de APU-01.

Salida:
- `transcript.txt`.
- `transcript.vtt`.
- `transcript.srt`.
- `transcript.json` con timestamps.

Responsabilidades:
- Convertir habla en texto.
- Mantener segmentos temporales.
- Marcar baja confianza cuando esté disponible.

No debe:
- Interpretar significados.
- Codificar categorías.
- Reemplazar revisión humana.

## 7. APU-03 — Diarización / Hablantes

Entrada:
- WAV preparado.
- Transcripción con timestamps.

Salida:
- Transcripción segmentada por hablante.
- Archivo editable de hablantes.

Responsabilidades:
- Detectar turnos de habla.
- Marcar `Speaker 1`, `Speaker 2`, etc.
- Permitir renombrar hablantes: entrevistador, participante, familiar, moderador.
- Permitir corrección manual.

Nota:
- Separar entrevistador/entrevistado es difícil y puede fallar.
- Esta unidad debe ser revisable, no una caja negra definitiva.

## 8. APU-04 — Limpieza textual

Entrada:
- Transcripción con hablantes.

Salida:
- Texto limpio y estructurado.
- JSON con segmentos preservados.

Responsabilidades:
- Corregir puntuación.
- Normalizar timestamps.
- Marcar inaudibles.
- Preservar pausas significativas.
- Opcional: anonimización.

## 9. APU-05 — Análisis cualitativo asistido por IA

Entrada:
- Transcripción limpia.
- Metadatos del estudio.

Salida:
- Códigos.
- Temas.
- Memos.
- Citas relevantes.
- Matrices comparativas.
- Resúmenes analíticos.

Responsabilidades:
- Apoyar codificación cualitativa.
- Sugerir patrones y temas.
- Extraer citas trazables.
- Comparar entrevistas o grupos focales.

Regla crítica:
- La IA asiste; la interpretación final corresponde al investigador.

## 10. APU-06 — Exportación

Entrada:
- Transcripciones, códigos, temas y memos.

Salida posible:
- Markdown.
- CSV.
- JSON.
- DOCX.
- Paquetes para NVivo, ATLAS.ti o MAXQDA si se implementa.

## 11. Contrato entre unidades

Cada unidad debe producir archivos legibles y auditables.

Regla recomendada:

```text
Cada salida principal debe acompañarse de metadatos JSON.
```

Ejemplo:

```text
entrevista_001_preparada.wav
entrevista_001_manifest.json
```

## 12. Principio metodológico

El ecosistema debe separar:

```text
Procesamiento técnico ≠ transcripción ≠ análisis ≠ interpretación
```

Esto protege:
- Trazabilidad.
- Revisión humana.
- Calidad metodológica.
- Ética en datos sensibles.
