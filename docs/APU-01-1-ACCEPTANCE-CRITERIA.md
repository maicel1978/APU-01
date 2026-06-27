# APU-01.1 ACCEPTANCE CRITERIA

PRISMA+ v5.2 — Fase -1 de iteración APU-01.1

## AC-01 — Selección de modo

Dado que el usuario abre la app,
cuando ve la zona de conversión,
entonces debe poder elegir entre:

```text
WAV estándar
WAV para transcripción
```

## AC-02 — Modo recomendado claro

Dado que el usuario no tiene conocimientos técnicos,
cuando observa las opciones,
entonces debe entender que “WAV para transcripción” es recomendado para entrevistas, grupos focales y sistemas ASR.

## AC-03 — Entrada WAV

Dado que el usuario selecciona un `.wav`,
cuando la app valida el archivo,
entonces debe aceptarlo como entrada válida.

## AC-04 — Entradas existentes conservadas

Dado que el usuario selecciona `.mp3` o `.ogg`,
cuando la app valida el archivo,
entonces debe seguir aceptándolos como antes.

## AC-05 — Salida WAV estándar

Dado que el usuario elige “WAV estándar”,
cuando convierte un archivo válido,
entonces la app genera un `.wav` como en la versión actual.

## AC-06 — Salida WAV para transcripción

Dado que el usuario elige “WAV para transcripción”,
cuando procesa un archivo válido,
entonces la app genera:

```text
WAV mono, 16 kHz, 16-bit PCM
```

## AC-07 — Nombre de salida preparado

Dado que se genera audio para transcripción,
cuando la app crea el archivo,
entonces el nombre debe usar sufijo:

```text
_prepared.wav
```

## AC-08 — Manifest JSON

Dado que se genera audio preparado,
cuando termina el procesamiento,
entonces debe generarse un manifest JSON con:

- versión de schema;
- unidad APU;
- modo de procesamiento;
- archivo fuente;
- archivo de salida;
- formato de salida;
- privacidad local;
- filtros/procesos aplicados.

## AC-09 — No sobrescribir original

Dado que el usuario procesa un archivo,
cuando descarga resultados,
entonces la app nunca modifica ni reemplaza el archivo original.

## AC-10 — Procesamiento en Worker

Dado que el audio se procesa,
cuando se ejecuta cualquier modo,
entonces el procesamiento pesado debe ocurrir en Web Worker.

## AC-11 — Progreso

Dado que el procesamiento puede tardar más de 1 segundo,
cuando está en curso,
entonces la UI debe mostrar progreso o estado incremental comprensible.

## AC-12 — Cancelación

Dado que el procesamiento está en curso,
cuando el usuario pulsa cancelar,
entonces la app debe detener el proceso de forma segura o terminar el Worker/motor interno.

## AC-13 — Privacidad local

Dado que el archivo puede contener información sensible,
cuando se procesa,
entonces no debe enviarse a servidores ni CDNs externas.

## AC-14 — Mensajes prudentes

Dado que el usuario usa el modo transcripción,
cuando lee la descripción,
entonces la app no debe prometer eliminación perfecta de ruido, eco o separación de hablantes.

## AC-15 — Conservación metodológica

Dado que se trabaja con entrevistas cualitativas,
cuando la app ofrece preparación acústica,
entonces debe recomendar conservar siempre el archivo original.

## AC-16 — Accesibilidad

Dado que se añaden nuevas opciones,
cuando el usuario navega con teclado,
entonces debe poder seleccionar el modo, convertir, cancelar y descargar sin usar mouse.

## AC-17 — Contratos actualizados

Dado que cambia el protocolo de procesamiento,
cuando se implementa APU-01.1,
entonces deben actualizarse:

- `docs/API-CONTRACTS.md`
- `docs/API-CONTRACTS-WORKER.md`
- `docs/DATA-CONTRACTS.md`
- `docs/ARCHITECTURE.md`

## AC-18 — Runtime vanilla

Dado que el proyecto sigue bajo PRISMA+,
cuando se implemente APU-01.1,
entonces el runtime debe seguir siendo HTML/CSS/Vanilla JS ES Modules sin frameworks.
