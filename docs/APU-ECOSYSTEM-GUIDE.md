# 🧭 Guía del Ecosistema APU — Para Desarrolladores y Mantenedores

**Versión:** 1.0  
**Fecha:** 2026-06-27  
**Propósito:** Documento central de referencia para crear, actualizar y mantener aplicaciones compatibles con el ecosistema APU.

---

## 1. Visión General del Ecosistema

El ecosistema **APU** (Audio Processing Units) es una suite de herramientas **locales, privadas y modulares** para investigación cualitativa y clínica basada en audio.

### Pipeline Recomendado

```
Grabación → APU-01 (Preparación) → APU-02 (Transcripción) 
→ APU-03 (Diarización) → APU-04 (Limpieza) 
→ APU-05 (Análisis) → APU-06 (Exportación)
```

**Principios inquebrantables:**
- Privacidad por defecto (nada sale del dispositivo)
- Procesamiento 100% local
- Trazabilidad entre etapas
- Revisión humana obligatoria en etapas interpretativas
- Sin frameworks runtime pesados (Vanilla JS + Web Workers)

---

## 2. Estándares Obligatorios (APU-COMMON-STANDARDS)

Todo módulo **debe** cumplir con:

### 2.1 Principios de Privacidad y Arquitectura

| Principio | Descripción |
|---------|-------------|
| Privacidad por defecto | Ningún dato sale del navegador sin consentimiento explícito |
| Procesamiento local | Siempre que sea técnicamente viable |
| Sin telemetría | Prohibido analytics, tracking o envío de datos |
| Archivos exportables | JSON, CSV, TXT legibles por humanos y máquinas |
| Trazabilidad | Cada salida debe poder rastrearse hasta el archivo original |
| Nunca sobrescribir original | Siempre generar copias |

### 2.2 Convenciones de Nombres de Archivos

**Formato recomendado:**

```
[estudio]_[caso]_[etapa].[ext]
```

**Ejemplos válidos:**
- `oncologia_p001_original.mp3`
- `oncologia_p001_prepared.wav`
- `oncologia_p001_manifest.json`
- `oncologia_p001_transcript.json`
- `oncologia_p001_speakers.json`

**Si no hay estudio/caso:** usar `audio_prepared.wav`

### 2.3 Etapas Estándar

| Etapa | Sufijo | Responsable |
|-------|--------|-------------|
| Original | `_original` | Usuario |
| Preparado | `_prepared` | **APU-01** |
| Transcrito | `_transcript` | **APU-02** |
| Hablantes | `_speakers` | **APU-03** |
| Limpio | `_clean` | **APU-04** |
| Codificado | `_codes` | **APU-05** |
| Temas | `_themes` | **APU-05** |
| Reporte | `_report` | **APU-06** |

---

## 3. Estándar de Manifest JSON

**Todo módulo debe generar un `manifest.json`** con la siguiente estructura base:

```json
{
  "schemaVersion": "1.0.0",
  "ecosystem": "APU",
  "unit": "APU-01",
  "stage": "prepared-audio",
  "createdAt": "2026-06-27T12:00:00.000Z",
  "source": {
    "fileName": "entrevista_p001_original.mp3",
    "format": "mp3",
    "sizeBytes": 2450000
  },
  "output": {
    "fileName": "entrevista_p001_prepared.wav",
    "format": "wav",
    "codec": "pcm_s16le",
    "channels": 1,
    "sampleRate": 16000,
    "bitDepth": 16,
    "sizeBytes": 1850000
  },
  "processing": {
    "mode": "transcription-prep",
    "highPassFilter": true,
    "dynamicNormalization": true,
    "lightCompression": true
  },
  "privacy": {
    "processedLocally": true,
    "networkUpload": false
  }
}
```

**Reglas obligatorias:**
- Siempre incluir `schemaVersion`
- Siempre incluir `ecosystem: "APU"`
- Siempre incluir `unit`
- Siempre incluir `privacy.processedLocally: true`

---

## 4. Arquitectura Técnica Recomendada (PRISMA+)

### 4.1 Stack Tecnológico

| Capa | Tecnología | Regla |
|------|------------|-------|
| Frontend | Vanilla JS (ES2022+) | Sin frameworks runtime |
| Procesamiento pesado | Web Workers | Obligatorio |
| Audio / IA | FFmpeg.wasm o Transformers.js | Siempre local |
| Comunicación | MessageChannel + Protocolo propio | Versión documentada |
| Estilo | CSS puro + variables | Coherente con ecosistema |

### 4.2 Estructura de Carpetas Recomendada

```
/
├── index.html
├── src/
│   ├── ui/
│   ├── core/
│   ├── workers/
│   ├── styles/
│   └── utils/
├── assets/
│   └── vendor/          # FFmpeg, Transformers, etc.
├── docs/
├── tests/
├── INICIAME.bat
├── INICIAME.ps1
├── serve.py
├── netlify.toml
├── manifest.json
├── 404.html
├── robots.txt
└── LICENSE
```

### 4.3 Reglas de Código (PRISMA+)

- **R1**: Sin frameworks runtime
- **R10**: Archivos cortos y enfocados (< 400 líneas ideal)
- **R14**: Cabecera PRISMA+ en cada archivo JS
- Máximo uso de `import.meta.url` para workers
- Manejo defensivo de errores con mensajes amigables

---

## 5. Reglas de Privacidad y Seguridad

### 5.1 Headers Obligatorios en Producción

Todo despliegue (Netlify, Vercel, etc.) **debe** incluir:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "require-corp"
    Content-Security-Policy = "..."
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### 5.2 Reglas de Comportamiento

- Nunca hacer requests a dominios externos sin consentimiento explícito
- Nunca almacenar audio en `localStorage` o `IndexedDB` de forma permanente
- Mostrar claramente cuando se usa un modelo de IA local vs externo

---

## 6. Lanzadores y Experiencia de Usuario

Toda aplicación **debe** incluir:

| Archivo | Propósito | Obligatorio |
|---------|---------|-------------|
| `INICIAME.bat` | Lanzador Windows CMD con headers | Sí |
| `INICIAME.ps1` | Lanzador PowerShell | Sí |
| `serve.py` | Servidor Python con COEP/COOP | Sí |
| `netlify.toml` | Despliegue profesional | Sí |
| `404.html` | Página de error personalizada | Sí |
| `manifest.json` | PWA + metadatos | Recomendado |

---

## 7. Documentación Mínima Requerida

Todo repositorio APU **debe** contener:

- `README.md` (claro, orientado a usuarios finales)
- `CHANGELOG.md`
- `LICENSE` (MIT recomendado)
- `docs/APU-ECOSYSTEM.md`
- `docs/APU-COMMON-STANDARDS.md`
- `docs/PRE-DEPLOY-CHECKLIST.md`
- `docs/ARCHITECTURE.md` (para módulos complejos)

---

## 8. Checklist de Compatibilidad de Nueva Aplicación

Antes de considerar una nueva herramienta como parte del ecosistema, debe pasar:

- [ ] Cumple con principios de privacidad
- [ ] Genera `manifest.json` con estructura estándar
- [ ] Usa convención de nombres de archivos
- [ ] Incluye lanzadores (`INICIAME.*`)
- [ ] Incluye `netlify.toml` con headers COOP/COEP
- [ ] Interfaz con lenguaje accesible (investigadores/médicos)
- [ ] Sin requests externos por defecto
- [ ] Tests automáticos + auditoría estática
- [ ] Documentación alineada con `APU-COMMON-STANDARDS`

---

## 9. Metodología PRISMA+

**PRISMA+** es el marco de desarrollo usado en todo el ecosistema.

### Principios clave:

- **R1**: Vanilla JS puro
- **R10**: Código limpio y mantenible
- **R14**: Cabeceras de documentación en cada módulo
- Arquitectura en capas: **UI → Core → Worker**
- Mensajes de error tipados y amigables
- Validación defensiva en todas las entradas

---

## 10. Recursos de Referencia Rápida

| Documento | Cuándo consultarlo |
|-----------|--------------------|
| `APU-COMMON-STANDARDS.md` | Crear nueva app o modificar contratos |
| `APU-ECOSYSTEM.md` | Entender el pipeline completo |
| `APU-01-1-MANIFEST-SCHEMA.md` | Estructura exacta del manifest |
| `ARCHITECTURE.md` | Diseño técnico de un módulo |
| `PRE-DEPLOY-CHECKLIST.md` | Antes de hacer push |
| `APU-ETHICS-AND-PRIVACY.md` | Aspectos éticos y regulatorios |

---

## 11. Cómo Contribuir o Crear una Nueva Unidad

1. Revisar `APU-COMMON-STANDARDS.md`
2. Clonar la estructura base de APU-01 o APU-02
3. Implementar usando la metodología PRISMA+
4. Generar manifest JSON compatible
5. Añadir lanzadores y `netlify.toml`
6. Pasar el `PRE-DEPLOY-CHECKLIST`
7. Actualizar `CHANGELOG.md` y `README.md`

---

**Este documento es la fuente de verdad para mantener la coherencia del ecosistema APU.**

Cualquier nueva aplicación, actualización importante o fork debe seguir estas directrices.