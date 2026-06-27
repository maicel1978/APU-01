# ============================================================
# INICIAME.ps1 — Lanzador oficial PowerShell para APU-01
# Ecosistema APU - Preparación Acústica Local
# ============================================================

$Host.UI.RawUI.WindowTitle = "APU-01 — Preparación Acústica"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  APU-01 — Preparación Acústica Local" -ForegroundColor Cyan
Write-Host "  Ecosistema APU (Privacy-First)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js no está instalado." -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[INFO] Node.js detectado correctamente." -ForegroundColor Green
Write-Host ""

# Crear serve.json si no existe
if (-not (Test-Path "serve.json")) {
    Write-Host "[INFO] Creando configuración de servidor con headers COEP/COOP..." -ForegroundColor Yellow
    
    $serveConfig = @{
        headers = @(
            @{
                source = "**/*"
                headers = @(
                    @{ key = "Cross-Origin-Opener-Policy"; value = "same-origin" },
                    @{ key = "Cross-Origin-Embedder-Policy"; value = "require-corp" },
                    @{ key = "Cross-Origin-Resource-Policy"; value = "cross-origin" }
                )
            }
        )
    } | ConvertTo-Json -Depth 5

    $serveConfig | Out-File -FilePath "serve.json" -Encoding UTF8
}

# Iniciar servidor
Write-Host "[INFO] Iniciando servidor con headers de seguridad..." -ForegroundColor Green
Write-Host ""

$npxArgs = @("serve", ".", "-p", "8080", "-c", "serve.json", "--no-request-logging")
Start-Process -FilePath "npx" -ArgumentList $npxArgs -NoNewWindow

# Esperar un poco
Start-Sleep -Seconds 2

# Abrir navegador
Write-Host "[INFO] Abriendo navegador en http://localhost:8080" -ForegroundColor Green
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Servidor activo en: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "  - Los headers COOP/COEP están activos" -ForegroundColor White
Write-Host "  - Puedes usar ambos modos de conversión" -ForegroundColor White
Write-Host "  - Cierra esta ventana para detener el servidor" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "Presiona Enter para salir"