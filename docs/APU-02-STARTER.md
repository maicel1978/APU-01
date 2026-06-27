# APU-02 Starter — Transcripción

PRISMA+ v5.2 — Documento inicial para futura unidad

## 1. Identidad propuesta

```text
APU-02 — Transcripción
```

Rol dentro del ecosistema:

```text
Convertir audio preparado por APU-01 en texto con timestamps.
```

## 2. Entrada esperada

Desde APU-01.1:

```text
[base]_prepared.wav
[base]_prepared_manifest.json
```

Formato de audio esperado:

```text
WAV
Mono
16 kHz
16-bit PCM
```

## 3. Salidas mínimas

```text
[base]_transcript.json
[base]_transcript.txt
```

Salidas opcionales:

```text
[base]_transcript.vtt
[base]_transcript.srt
```

## 4. Contrato JSON inicial

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-02",
  "stage": "transcript",
  "sourceAudio": "entrevista_prepared.wav",
  "sourceManifest": "entrevista_prepared_manifest.json",
  "language": "es",
  "segments": [
    {
      "id": "seg-001",
      "start": 0.0,
      "end": 4.2,
      "text": "Texto transcrito.",
      "confidence": null
    }
  ]
}
```

## 5. Decisiones bloqueantes para Fase -1 de APU-02

Antes de implementar, decidir:

1. ¿Transcripción local, externa o ambos modos?
2. Si es local, ¿qué modelo usar?
3. Si es externa, ¿qué proveedor y qué aviso de privacidad?
4. ¿Idiomas soportados inicialmente?
5. ¿Se requiere edición manual de segmentos?
6. ¿Se exporta VTT/SRT desde el MVP?

## 6. Opciones técnicas posibles

### Opción A — Local en navegador

Ventajas:
- Privacidad máxima.
- Sin subida de audio.

Desventajas:
- Modelos pesados.
- Memoria alta.
- Velocidad variable.

### Opción B — Servicio externo explícito

Ventajas:
- Mejor velocidad y precisión.
- Menor carga del navegador.

Desventajas:
- Requiere red.
- Requiere consentimiento explícito.
- Riesgo en datos sensibles.

### Opción C — Híbrido

Ventajas:
- Permite elegir privacidad o rendimiento.

Desventajas:
- UX y contratos más complejos.

## 7. Recomendación inicial

Para mantener coherencia APU:

```text
Default: local si es viable.
Alternativa externa: solo con consentimiento explícito.
```

Si se usa red, la UI debe decir claramente:

```text
Este modo enviará el audio/texto a un proveedor externo.
```

## 8. Qué NO debe hacer APU-02

APU-02 no debe:
- Diarizar hablantes como función principal.
- Interpretar contenido.
- Codificar cualitativamente.
- Resumir hallazgos.
- Emitir conclusiones clínicas.

Eso queda para APU-03, APU-04 y APU-05.

## 9. Criterios de éxito iniciales

APU-02 cumple si:

- Recibe WAV preparado de APU-01.
- Produce texto con timestamps.
- Exporta JSON trazable.
- Mantiene privacidad clara.
- Permite revisión humana posterior.

## 10. Prompt recomendado para iniciar

```text
Iniciar APU-02 — Transcripción bajo PRISMA+ v5.2.
Usar como entrada docs/APU-HANDOFF.md y docs/APU-02-STARTER.md.
Mantener APU-02 como unidad separada de APU-01.
```
