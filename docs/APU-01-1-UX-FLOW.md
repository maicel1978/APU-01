# APU-01.1 UX FLOW — Modo Preparar para transcripción

PRISMA+ v5.2 — Fase -1 de iteración APU-01.1

## 1. Intención UX

Mantener la experiencia simple para médicos e investigadores.

La app debe seguir funcionando como una herramienta de una pantalla, con una nueva decisión fácil:

```text
¿Qué tipo de WAV necesitas?
```

## 2. Modos visibles

### Opción A — WAV estándar

Texto recomendado:

```text
Convierte el audio a WAV para compatibilidad general.
```

Uso:
- Cuando el usuario solo necesita un WAV.
- Cuando no quiere procesamiento adicional.

### Opción B — WAV para transcripción

Texto recomendado:

```text
Recomendado para entrevistas, grupos focales y transcripción automática.
Genera WAV mono, 16 kHz, 16 bits.
```

Uso:
- Whisper.
- Sistemas ASR.
- Entrevistas clínicas.
- Investigación cualitativa.

## 3. Flujo principal

1. Usuario abre la app.
2. Ve una nota de privacidad local.
3. Selecciona modo:

```text
○ WAV estándar
● WAV para transcripción
```

4. Arrastra o selecciona archivo.
5. La app valida formato/tamaño/memoria.
6. Si es válido, muestra:
   - nombre del archivo;
   - tamaño;
   - modo seleccionado;
   - salida esperada.
7. Usuario pulsa botón principal.
8. La app procesa en Worker.
9. La UI muestra progreso/estado.
10. Usuario puede cancelar.
11. Al terminar:
    - muestra botón de descarga WAV;
    - si modo transcripción, muestra botón de descarga manifest JSON.

## 4. Botón principal

El texto puede cambiar según modo.

### WAV estándar

```text
Convertir a WAV
```

### WAV para transcripción

```text
Preparar para transcripción
```

## 5. Mensajes importantes

### Privacidad

```text
El audio se procesa en este navegador y no se sube a servidores.
```

### Conservación del original

```text
Conserva siempre el audio original. El archivo preparado es una copia para facilitar la transcripción.
```

### Límite honesto

```text
La preparación puede mejorar la consistencia del audio, pero no corrige todos los problemas de grabación.
```

## 6. Estado completado

### WAV estándar

```text
Archivo WAV listo.
```

Botón:

```text
Descargar WAV
```

### WAV para transcripción

```text
Audio preparado para transcripción.
```

Botones:

```text
Descargar WAV preparado
Descargar manifest JSON
```

## 7. Estados de error

Mantener lenguaje no técnico.

Ejemplos:

```text
Este formato no está soportado. Usa MP3, OGG o WAV.
```

```text
Este archivo es demasiado grande para procesarlo de forma segura en este navegador.
```

```text
No pudimos preparar este audio. Prueba con un archivo más corto o con menos ruido.
```

## 8. Silencios

No añadir controles técnicos de silencios en el MVP de APU-01.1.

Si se menciona, usar lenguaje conservador:

```text
La app preserva pausas importantes y evita recortes agresivos.
```

## 9. Entrevistador / entrevistado

No incluir esta función en la UI.

Si el usuario pregunta, orientar a una futura unidad:

```text
La identificación de hablantes pertenece a APU-03 — Diarización / Hablantes.
```

## 10. Diseño recomendado

Mantener:
- una pantalla;
- pocos botones;
- texto claro;
- foco visible;
- `aria-live` para estados;
- drag & drop complementario al selector;
- ninguna configuración avanzada obligatoria.
