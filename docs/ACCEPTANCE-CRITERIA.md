# ACCEPTANCE CRITERIA — Conversor local de audio a WAV

PRISMA+ v5.2 — Fase -1 Descubrimiento

## Criterios funcionales

### AC-01 — Carga simple de audio
Dado que el usuario abre la app,
cuando selecciona o arrastra un archivo `.mp3` o `.ogg`,
entonces el archivo aparece con nombre, tamaño y estado comprensible.

### AC-02 — Validación de formato
Dado que el usuario carga un archivo no soportado,
cuando la app lo revisa,
entonces lo rechaza sin procesarlo y muestra un mensaje simple, por ejemplo: “Este formato no está soportado. Usa MP3 u OGG.”

### AC-03 — Corrección de extensión probable
Dado que el usuario intenta cargar un archivo `.pm3`,
cuando la app detecta la extensión,
entonces debe mostrar un mensaje útil: “No reconocemos .pm3. Si querías usar MP3, revisa el nombre del archivo.”

### AC-04 — Conversión a WAV
Dado un archivo `.mp3` o `.ogg` válido,
cuando el usuario pulsa “Convertir a WAV”,
entonces la app genera un archivo `.wav` descargable.

### AC-05 — No bloqueo de UI
Dado que una conversión está en curso,
cuando el usuario mueve el cursor, usa teclado o pulsa cancelar,
entonces la interfaz sigue respondiendo.

### AC-06 — Worker obligatorio
Dado que el procesamiento de audio empieza,
cuando se ejecuta la conversión,
entonces el trabajo pesado ocurre en un Web Worker y no en el hilo principal.

### AC-07 — Progreso visible y comprensible
Dado que una conversión tarda más de 1 segundo,
cuando el procesamiento está activo,
entonces el usuario ve un estado como “Convirtiendo audio…” y una barra o porcentaje si está disponible.

### AC-08 — Cancelación visible
Dado que una conversión está en curso,
cuando el usuario pulsa “Cancelar”,
entonces la app intenta detener el proceso y muestra “Conversión cancelada”.

### AC-09 — Errores no técnicos
Dado que una conversión falla,
cuando se captura el error,
entonces el usuario ve un mensaje accionable sin stack trace, códigos internos ni jerga innecesaria.

### AC-10 — Límite de memoria preventivo
Dado que el archivo puede ser demasiado grande para el navegador,
cuando la app estima el coste,
entonces debe advertir o rechazar antes de iniciar la conversión.

### AC-11 — Privacidad local
Dado que el usuario carga audio posiblemente sensible,
cuando se procesa el archivo,
entonces ningún dato se envía a red salvo decisión explícita futura del usuario y documentación correspondiente.

## Criterios de UX minimalista

### AC-12 — Una pantalla principal
La app debe poder usarse desde una sola pantalla principal, sin configuración avanzada obligatoria.

### AC-13 — Lenguaje claro
Los textos visibles deben ser comprensibles para médicos e investigadores sin conocimientos técnicos avanzados.

### AC-14 — Acción principal evidente
Debe existir un botón principal claro: “Convertir a WAV”.

### AC-15 — Estado vacío útil
Al iniciar, la app explica en una frase qué hace y qué formatos acepta.

### AC-16 — Feedback drag & drop
Durante arrastre sobre la zona de carga, la app muestra feedback visual claro y sobrio.

### AC-17 — Resultado descargable claro
Al finalizar, el usuario ve un botón o enlace: “Descargar WAV”.

## Criterios de accesibilidad

### AC-18 — Navegación por teclado
La carga, conversión, cancelación y descarga deben poder operarse con teclado.

### AC-19 — Estados anunciados
Estados de progreso, finalización y error deben exponerse mediante región `aria-live`.

### AC-20 — Foco visible
Los controles interactivos deben tener foco visible.

### AC-21 — Labels claros
Inputs y controles deben tener labels o texto accesible.

## Criterios técnicos

### AC-22 — Runtime vanilla
El output de producción no usa frameworks runtime.

### AC-23 — Documentación
Los contratos, arquitectura y estado deben mantenerse documentados en `/docs` según avance el proyecto.

### AC-24 — Robustez antes que funciones avanzadas
Si una función avanzada aumenta el riesgo de bloqueo, confusión o consumo excesivo de memoria, debe quedar fuera del MVP.
