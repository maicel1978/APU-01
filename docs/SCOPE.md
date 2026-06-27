# SCOPE — Conversor local de audio a WAV

PRISMA+ v5.2 — Fase -1 Descubrimiento

## Nombre tentativo
Audio WAV Clínico

## Objetivo
Crear una aplicación web estática, minimalista y robusta para convertir archivos de audio comunes a formato WAV directamente en el navegador, evitando bloqueos de la interfaz.

La app está orientada a médicos, investigadores y personal técnico/no técnico que necesita una herramienta simple, confiable y clara, sin conocimientos avanzados de audio o informática.

## Core del producto
El usuario carga audio, la app lo valida, lo convierte localmente en segundo plano mediante Web Worker y entrega un archivo `.wav` descargable con mensajes simples y estados visibles.

## Entradas previstas
- Archivos de audio comunes, inicialmente:
  - `.mp3` — asumido a partir de `.pm3`, probable error tipográfico.
  - `.ogg`
- Carga mediante:
  - Drag & drop.
  - Botón visible “Seleccionar audio”.

## Salidas previstas
- Archivo `.wav` descargable.
- Estado simple de conversión:
  - Pendiente.
  - Revisando archivo.
  - Convirtiendo.
  - Listo para descargar.
  - Error explicado.
- Mensajes pensados para usuarios no técnicos.

## Usuarios objetivo
- Médicos.
- Investigadores clínicos o biomédicos.
- Personal académico o de laboratorio.
- Usuarios con pocos conocimientos técnicos que necesitan obtener WAV para análisis, documentación o interoperabilidad con otras herramientas.

## Principios de producto
1. Minimalismo: la pantalla debe mostrar solo lo necesario.
2. Robustez: validar antes de procesar y evitar cuelgues.
3. Claridad: usar lenguaje humano, no jerga técnica.
4. Privacidad: todo ocurre localmente en el navegador.
5. Control: mostrar progreso y permitir cancelar.
6. Seguridad de UX: si algo no puede hacerse, explicarlo y proponer una acción.

## Alcance MVP
Incluye:
- Conversión local de `.mp3` y `.ogg` a `.wav`.
- Procesamiento fuera del hilo principal para evitar cuelgues del navegador.
- Interfaz minimalista de una sola pantalla.
- Botón principal claro: “Convertir a WAV”.
- Progreso visible con texto simple.
- Cancelación de tareas.
- Validación de tipo, tamaño y memoria estimada.
- Descarga del resultado.
- Mensajes de error accionables y no técnicos.
- Accesibilidad mínima: teclado, foco visible, labels y `aria-live`.

No incluye en MVP:
- Edición de audio.
- Recorte, normalización, mezcla o efectos.
- Ajustes avanzados de frecuencia, bitrate o canales expuestos al usuario.
- Subida a servidores.
- Conversión en backend.
- Guardado persistente en nube.
- Conversión masiva ilimitada.
- Paneles técnicos avanzados.

## Decisión de UX para minimalismo
La app debe favorecer el flujo de un archivo a la vez en el MVP para reducir riesgo de errores, consumo de memoria y confusión.

Se podrá considerar lote en una fase futura si no compromete la experiencia simple.

## Supuestos iniciales
1. `.pm3` significa `.mp3`.
2. Todo debe procesarse localmente por privacidad.
3. La prioridad es estabilidad del navegador y comprensión del usuario sobre velocidad máxima.
4. Los mensajes deben evitar términos como “codec”, “heap”, “thread” o “stack trace” salvo en documentación interna.
5. El WAV resultante puede conservar parámetros técnicos razonables del audio original sin mostrar opciones avanzadas al usuario.

## Preguntas pendientes no bloqueantes
- ¿Los audios suelen ser cortos, por ejemplo notas o registros de pocos minutos, o pueden ser grabaciones largas?
- ¿La app debe mostrar alguna advertencia legal/ética sobre datos clínicos sensibles?

## Restricciones PRISMA+ relevantes
- Runtime final vanilla: HTML5 + CSS3 + JS ES2022+ Modules.
- Audio siempre en Web Worker.
- Tareas superiores a 1 segundo requieren progreso y cancelación.
- Privacidad local por defecto.
- Programación defensiva y mensajes útiles.
