# UX FLOW — Conversor local de audio a WAV

PRISMA+ v5.2 — Fase -1 Descubrimiento

## Intención de UX
La aplicación debe sentirse como una herramienta clínica/académica simple: sobria, clara, segura y sin distracciones.

El usuario no debe necesitar entender formatos internos, codecs, memoria, workers ni parámetros de audio.

## Flujo principal minimalista

1. Usuario abre la app.
2. Ve una pantalla única con:
   - Título claro: “Convertir audio a WAV”.
   - Subtítulo: “Convierte archivos MP3 u OGG en tu navegador. Tus audios no se suben a ningún servidor.”
   - Zona de carga.
   - Botón “Seleccionar audio”.
3. Usuario añade un archivo.
4. La app revisa automáticamente:
   - Formato.
   - Tamaño.
   - Posible consumo de memoria.
5. Si el archivo es válido:
   - Se muestra nombre del archivo.
   - Se habilita el botón “Convertir a WAV”.
6. Si el archivo no es válido:
   - Se muestra error claro.
   - Se sugiere una acción sencilla.
7. Usuario pulsa “Convertir a WAV”.
8. La app inicia el procesamiento en Worker.
9. Durante el proceso se muestra:
   - Estado simple: “Convirtiendo audio…”.
   - Barra de progreso o indicador de actividad.
   - Botón “Cancelar”.
10. Si termina correctamente:
    - Se muestra “Archivo listo”.
    - Aparece botón “Descargar WAV”.
11. Si falla:
    - Se muestra una explicación simple.
    - Se permite intentar con otro archivo.
12. Usuario puede limpiar la pantalla y convertir otro audio.

## Estados de pantalla

### Estado vacío
Texto sugerido:
“Selecciona un archivo MP3 u OGG para convertirlo a WAV. Todo ocurre localmente en tu navegador.”

Controles:
- Botón “Seleccionar audio”.
- Zona drag & drop opcional pero visible.

### Estado revisando archivo
Texto sugerido:
“Revisando el archivo…”

Objetivo:
Dar feedback inmediato tras seleccionar el archivo.

### Estado listo para convertir
Muestra:
- Nombre del archivo.
- Tamaño legible.
- Botón principal “Convertir a WAV”.
- Botón secundario “Cambiar archivo”.

### Estado procesando
Muestra:
- “Convirtiendo audio…”
- Progreso si está disponible.
- Botón “Cancelar”.
- Nota breve: “Puedes cancelar si tarda demasiado.”

### Estado completado
Muestra:
- “Archivo WAV listo”.
- Botón “Descargar WAV”.
- Botón secundario “Convertir otro audio”.

### Estado error
Muestra:
- Mensaje humano.
- Acción recomendada.

Ejemplos:
- “Este archivo es demasiado grande para procesarlo de forma segura en este navegador.”
- “No pudimos leer este audio. Prueba con otro archivo MP3 u OGG.”
- “No reconocemos .pm3. Si querías usar MP3, revisa el nombre del archivo.”

## Decisiones de simplificación

### Una conversión activa
En el MVP se recomienda una conversión activa a la vez.

Razón:
- Reduce uso de memoria.
- Disminuye riesgo de bloqueo.
- Es más claro para usuarios no técnicos.

### Sin configuración avanzada visible
No se mostrarán opciones como frecuencia de muestreo, canales, bitrate o codec.

Razón:
- Evita decisiones técnicas innecesarias.
- Mantiene la experiencia simple.

### Mensajes clínicamente prudentes
Como puede tratarse de audio sensible, la interfaz debe indicar que el procesamiento es local.

Texto sugerido:
“Privacidad: el audio se procesa en este navegador y no se sube a servidores.”

## Casos edge de UX

- Usuario carga `.pm3`: mostrar corrección probable, pero no renombrar ni procesar automáticamente.
- Usuario carga archivo muy grande: rechazar preventivamente con explicación.
- Usuario intenta convertir mientras ya hay una conversión: mantener una sola tarea activa.
- Usuario cancela: liberar estado y permitir elegir otro archivo.
- Navegador sin APIs necesarias: mostrar incompatibilidad de forma clara.

## Principios de interacción

- Pocos botones, todos con texto claro.
- Acción principal visualmente dominante.
- Estados visibles en todo momento.
- Ningún error técnico bruto en pantalla.
- La UI debe seguir respondiendo aunque el audio sea pesado.
