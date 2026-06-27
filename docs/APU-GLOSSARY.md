# APU Glossary

PRISMA+ v5.2 — Glosario común del ecosistema

## APU

Acoustic & Qualitative Preparation Units.

Ecosistema modular para preparar, transcribir, estructurar y analizar datos cualitativos derivados de audio.

## Preparación acústica

Etapa técnica que convierte y acondiciona una grabación para facilitar transcripción automática.

No equivale a transcripción ni análisis.

## Audio original

Archivo fuente sin modificar.

Regla:
- Nunca debe sobrescribirse.

## Audio preparado

Archivo derivado del original, optimizado para una etapa posterior.

En APU-01.1 se recomienda:

```text
WAV mono, 16 kHz, 16-bit PCM
```

## Transcripción

Conversión de habla a texto.

Puede incluir:
- Timestamps.
- Segmentos.
- Confianza.

## Diarización

Identificación de quién habla y cuándo.

Ejemplo:

```text
Speaker 1: Entrevistador
Speaker 2: Participante
```

No es lo mismo que separar físicamente voces en pistas distintas.

## Separación de voces

Proceso para aislar voces en audios separados.

Es más difícil que la diarización y no debe prometerse como función básica.

## Segmento

Fragmento de audio o texto con inicio y final.

Ejemplo:

```json
{ "start": 10.5, "end": 15.2, "text": "..." }
```

## Código cualitativo

Etiqueta analítica aplicada a uno o varios segmentos.

Ejemplo:

```text
Experiencia de dolor
Barreras de acceso
Confianza institucional
```

## Tema

Patrón interpretativo de mayor nivel que agrupa códigos o hallazgos.

## Memo

Nota analítica escrita por el investigador durante el análisis.

## Trazabilidad

Capacidad de conectar un resultado analítico con su origen:

```text
tema → código → cita → segmento → audio original
```

## Manifest

Archivo JSON que describe cómo se generó una salida.

Ejemplo:

```text
entrevista_prepared.wav
entrevista_manifest.json
```

## ASR

Automatic Speech Recognition.

Sistema de reconocimiento automático de voz, por ejemplo Whisper.

## QDA

Qualitative Data Analysis.

Análisis de datos cualitativos.

## Revisión humana

Proceso por el cual una persona valida, corrige o rechaza resultados generados automáticamente.

Regla del ecosistema:
- Las etapas interpretativas siempre requieren revisión humana.
