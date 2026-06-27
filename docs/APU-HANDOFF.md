# APU Handoff — Continuar el ecosistema en otra sección

PRISMA+ v5.2 — Documento de transferencia

## 1. Propósito

Este documento permite cerrar APU-01.1 y continuar el resto del ecosistema APU en otra sesión o sección sin perder contexto.

APU-01.1 queda como base estable:

```text
APU-01 — Preparación Acústica
```

No se debe mezclar aquí transcripción, diarización ni análisis cualitativo.

## 2. Estado cerrado de APU-01.1

La app puede:

- Aceptar MP3, OGG y WAV.
- Convertir a WAV estándar.
- Preparar WAV para transcripción.
- Generar WAV mono, 16 kHz, 16-bit PCM.
- Generar manifest JSON.
- Procesar localmente en Worker.
- Mantener privacidad local.

Protocolo:

```text
Protocol Version: 1.2.0
```

## 3. Archivos que representan el cierre

Leer en este orden:

1. `README.md`.
2. `docs/CURRENT-STATUS.md`.
3. `docs/ARCHITECTURE.md`.
4. `docs/API-CONTRACTS.md`.
5. `docs/API-CONTRACTS-WORKER.md`.
6. `docs/QA-REPORT.md`.
7. `docs/APU-ECOSYSTEM.md`.
8. `docs/APU-COMMON-STANDARDS.md`.
9. `docs/DATA-CONTRACTS.md`.

## 4. Para continuar en una nueva sesión

Pegar al nuevo agente:

```text
1. Prompt PRISMA+ completo.
2. docs/CURRENT-STATUS.md.
3. docs/ARCHITECTURE.md.
4. docs/APU-HANDOFF.md.
5. docs/APU-02-STARTER.md si se va a iniciar APU-02.
```

## 5. Separación de unidades

Mantener esta separación:

```text
APU-01 Preparación Acústica
APU-02 Transcripción
APU-03 Diarización / Hablantes
APU-04 Limpieza textual
APU-05 Análisis cualitativo asistido
APU-06 Exportación
```

Regla:
- Cada unidad debe tener entrada, salida y contratos propios.

## 6. Qué NO añadir a APU-01

No añadir a esta app:

- Transcripción automática.
- Identificación de hablantes.
- Separación de voces.
- Codificación cualitativa.
- Resúmenes con IA.
- Interpretación clínica.

Si se necesita algo de eso, iniciar otra unidad APU.

## 7. Salida esperada de APU-01 para unidades futuras

Archivo principal:

```text
[base]_prepared.wav
```

Manifest:

```text
[base]_prepared_manifest.json
```

Propiedades esperadas:

```text
WAV
Mono
16 kHz
16-bit PCM
Procesado localmente
Sin subida a red
```

## 8. Contratos para usar en APU-02

APU-02 debe aceptar:

```text
[base]_prepared.wav
[base]_prepared_manifest.json
```

Y producir, como mínimo:

```text
[base]_transcript.json
[base]_transcript.txt
```

Opcional:

```text
[base]_transcript.vtt
[base]_transcript.srt
```

## 9. Reglas éticas heredadas

- No enviar datos a red por defecto.
- Si se usa proveedor externo, pedir consentimiento explícito.
- No prometer transcripción perfecta.
- Mantener revisión humana.
- Preservar trazabilidad hacia audio original.

## 10. Siguiente paso recomendado

Cuando se quiera continuar:

```text
Iniciar APU-02 — Transcripción
```

Pero hacerlo como proyecto/sección separada, no como ampliación silenciosa de APU-01.
