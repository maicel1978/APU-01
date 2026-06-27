# ============================================================
# INICIAME.ps1 — Lanzador local para APU-01 (PowerShell)
# ============================================================

$Host.UI.RawUI.WindowTitle = "APU-01 — Preparación Acústica"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  APU-01 — Preparación Acústica Local" -ForegroundColor Cyan
Write-Host "  Privacidad por defecto - sin descargas npx" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }

if (-not $python) {
    Write-Host "[ERROR] No se encontro Python." -ForegroundColor Red
    Write-Host "Instala Python o ejecuta manualmente un servidor local con COOP/COEP." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[INFO] Iniciando servidor local con headers COOP/COEP..." -ForegroundColor Green
Start-Process "http://localhost:8080"
& $python.Source "serve.py" "8080"
