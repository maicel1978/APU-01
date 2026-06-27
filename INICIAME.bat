@echo off
:: ============================================================
:: INICIAME.bat — Lanzador local para APU-01 (Windows)
:: ============================================================

title APU-01 — Preparación Acústica

echo.
echo ================================================
echo   APU-01 — Preparación Acústica Local
echo   Privacidad por defecto - sin descargas npx
echo ================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Iniciando servidor local con headers COOP/COEP...
    start http://localhost:8080
    python serve.py 8080
    goto :end
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Iniciando servidor local con headers COOP/COEP...
    start http://localhost:8080
    py serve.py 8080
    goto :end
)

echo [ERROR] No se encontro Python.
echo Instala Python o ejecuta manualmente un servidor local con COOP/COEP.

:end
pause
