# ✅ Pre-Deploy Checklist — APU-01

**Proyecto:** APU-01 — Preparación Acústica  
**Objetivo:** Verificar que todo esté listo antes de hacer push y desplegar en Netlify.

---

## 1. Tests Automáticos

- [ ] Ejecutar `npm test` y que todos pasen
  ```bash
  npm test
  ```
- [ ] Verificar que el Static Audit no muestre errores de PRISMA+

---

## 2. Pruebas Funcionales de la Aplicación

### Pruebas básicas de UI
- [ ] La interfaz carga sin errores en consola
- [ ] Ambos modos de salida están disponibles (`transcription-prep` y `standard-wav`)
- [ ] El selector de modo cambia correctamente el texto del botón principal
- [ ] Drag & drop funciona
- [ ] Botón de selección de archivo funciona

### Pruebas de procesamiento
- [ ] Procesar un archivo MP3 en modo **transcripción** → genera `_prepared.wav` + `manifest.json`
- [ ] Procesar un archivo MP3 en modo **estándar** → genera solo `.wav`
- [ ] Procesar un archivo OGG
- [ ] Procesar un archivo WAV
- [ ] La barra de progreso funciona correctamente
- [ ] El botón **Cancelar** funciona durante el procesamiento
- [ ] Los botones de descarga aparecen después de procesar

### Validaciones defensivas
- [ ] Intentar subir un archivo `.txt` → muestra error claro
- [ ] Intentar subir un archivo `.pm3` → muestra sugerencia útil
- [ ] Intentar subir un archivo vacío → error

---

## 3. Headers de Seguridad (Obligatorio)

### Local (con `INICIAME.bat` o `serve.py`)
- [ ] Ejecutar `self.crossOriginIsolated` en la consola del navegador → debe devolver `true`
- [ ] Verificar en DevTools → Network que aparecen los headers:
  - `cross-origin-opener-policy: same-origin`
  - `cross-origin-embedder-policy: require-corp`

### En Netlify (después del deploy)
- [ ] Verificar los mismos headers en producción
- [ ] Confirmar que `crossOriginIsolated === true`

---

## 4. Privacidad y Comportamiento Local

- [ ] Abrir DevTools → Pestaña **Network**
- [ ] Procesar un archivo y verificar que **no hay requests** a dominios externos (solo assets locales)
- [ ] Confirmar que FFmpeg.wasm se carga desde `/assets/vendor/ffmpeg/`

---

## 5. Archivos de Despliegue

Verificar que existan y estén correctos:

- [ ] `netlify.toml` (con COOP/COEP + CSP)
- [ ] `404.html`
- [ ] `manifest.json`
- [ ] `robots.txt`
- [ ] `LICENSE`
- [ ] Licencia MIT presente y enlazada desde README
- [ ] `INICIAME.bat`
- [ ] `INICIAME.ps1`
- [ ] `serve.py`

---

## 6. Documentación y Ecosistema APU

- [ ] `README.md` actualizado con sección de despliegue en Netlify
- [ ] `CHANGELOG.md` actualizado con el último commit
- [ ] Todos los documentos en `/docs` siguen los estándares del ecosistema
- [ ] El manifest JSON generado por la app cumple con el esquema de APU

---

## 7. Git y Repositorio

- [ ] No hay archivos sensibles en el repositorio (`.env`, credenciales, etc.)
- [ ] `.gitignore` está actualizado
- [ ] El commit final tiene un mensaje claro y descriptivo
- [ ] Todas las ramas están actualizadas (`git status` limpio)

---

## 8. Pruebas de Despliegue en Netlify (Post-Deploy)

Después de hacer push y desplegar:

- [ ] La URL de Netlify carga correctamente
- [ ] Ambos modos de conversión funcionan
- [ ] Descarga de WAV + manifest funciona
- [ ] Página 404 personalizada funciona
- [ ] `manifest.json` es accesible públicamente
- [ ] `robots.txt` es accesible públicamente
- [ ] Lighthouse (opcional pero recomendado):
  - Performance ≥ 80
  - Accessibility ≥ 95
  - Best Practices ≥ 90

---

## 9. Checklist Final Antes de Hacer Push

Ejecutar estos comandos antes del commit final:

```bash
# 1. Tests
npm test

# 2. Verificar que no hay archivos sin trackear importantes
git status

# 3. Revisar los últimos commits
git log --oneline -5

# 4. (Opcional) Limpiar archivos temporales
rm -f serve.json
```

---

## 10. Criterios de Aceptación (Go / No-Go)

| Criterio                              | Estado     | Notas |
|---------------------------------------|------------|-------|
| Todos los tests automáticos pasan     | ⬜         |       |
| `crossOriginIsolated === true`        | ⬜         |       |
| Sin requests externos en Network      | ⬜         |       |
| Ambos modos de conversión funcionan   | ⬜         |       |
| `netlify.toml` con COOP/COEP          | ⬜         |       |
| Archivos de despliegue presentes      | ⬜         |       |
| Documentación actualizada             | ⬜         |       |

---

**Fecha de última revisión:** 2026-06-28  
**Versión del checklist:** 1.1

> **Recomendación:** Marca cada ítem conforme lo vayas verificando. Solo marca "Go" cuando todos los ítems críticos estén completos.