# PROJECT TREE — Estructura final APU-01.1

PRISMA+ v5.2

```text
/
├── .github/workflows/ci.yml
├── .gitignore
├── CHANGELOG.md
├── README.md
├── index.html
├── package.json
├── assets/vendor/ffmpeg/
├── docs/
│   ├── APU-02-STARTER.md
│   ├── APU-HANDOFF.md
│   ├── GITHUB-PUBLISHING.md
│   ├── RELEASE-CHECKLIST.md
│   └── ...
├── src/
│   ├── core/
│   ├── styles/
│   ├── ui/
│   ├── utils/
│   └── workers/
└── tests/
    ├── core-smoke.mjs
    └── static-audit.mjs
```

## Identidad

```text
APU-01 — Preparación Acústica
APU-01.1 — Modo Preparar para transcripción
```

## Documentos de publicación

| Archivo | Propósito |
|---|---|
| `README.md` | Presentación principal |
| `docs/GITHUB-PUBLISHING.md` | Subir a GitHub y Pages |
| `docs/RELEASE-CHECKLIST.md` | Checklist final |
| `docs/QA-REPORT.md` | QA y riesgos |

## Documentos de continuidad

| Archivo | Propósito |
|---|---|
| `docs/APU-HANDOFF.md` | Transferir contexto a otra sesión |
| `docs/APU-02-STARTER.md` | Iniciar APU-02 Transcripción |
| `docs/APU-ECOSYSTEM.md` | Visión del ecosistema |
| `docs/DATA-CONTRACTS.md` | Contratos entre unidades |

## Código clave

| Archivo | Propósito |
|---|---|
| `src/ui/app.js` | UI, eventos y descargas |
| `src/core/conversion-controller.js` | Orquestación protocolo 1.2.0 |
| `src/core/manifest.js` | Manifest JSON |
| `src/workers/audio-conversion.worker.js` | FFmpeg.wasm y pipelines |
