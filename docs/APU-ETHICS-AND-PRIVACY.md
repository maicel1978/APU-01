# APU Ethics and Privacy

PRISMA+ v5.2 — Principios éticos y privacidad

## 1. Propósito

Definir criterios mínimos para herramientas APU que trabajen con entrevistas clínicas, grupos focales o datos cualitativos sensibles.

## 2. Privacidad por defecto

Regla base:

```text
Ningún archivo se envía a internet salvo consentimiento explícito del usuario.
```

APU-01 cumple:
- Procesamiento local.
- FFmpeg.wasm local.
- Sin telemetría.
- Sin CDN obligatoria.

## 3. Consentimiento explícito para red

Si una unidad futura usa servicios externos:
- Debe indicarlo antes de procesar.
- Debe explicar qué archivo o texto se enviará.
- Debe requerir confirmación clara.
- Debe documentarse en arquitectura y contratos.

## 4. Conservación del original

Regla:
- Nunca sobrescribir el archivo original.
- Toda salida debe ser derivada y descargable con nombre distinto.

Ejemplo:

```text
entrevista_original.mp3
entrevista_prepared.wav
```

## 5. Transparencia de procesamiento

Cada unidad debe explicar:
- Qué transforma.
- Qué no transforma.
- Qué limitaciones tiene.
- Qué archivos genera.

## 6. Investigación cualitativa

En análisis cualitativo:
- Las pausas pueden ser significativas.
- La emoción y contexto no deben borrarse sin criterio.
- Los algoritmos pueden sesgar la interpretación.
- La IA no reemplaza al investigador.

## 7. Transcripción y diarización

Las transcripciones automáticas pueden contener errores.

La diarización puede confundir hablantes.

Regla:
- Toda transcripción o atribución de hablante debe poder revisarse manualmente.

## 8. Anonimización

Una unidad futura puede añadir anonimización, pero debe ser revisable.

No prometer anonimización perfecta sin validación humana.

## 9. Uso clínico

Estas herramientas no emiten diagnósticos ni recomendaciones clínicas.

APU apoya preparación, organización y análisis de datos, pero no sustituye juicio profesional ni revisión ética.

## 10. Registro de decisiones

Toda decisión importante de procesamiento debe quedar documentada:
- En manifest JSON.
- En documentación del proyecto.
- En el historial de cambios si modifica contratos.
