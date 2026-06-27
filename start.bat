@echo off
title APU-01 — Servidor Simple

echo.
echo ================================================
echo   APU-01 — Servidor de desarrollo
echo ================================================
echo.

:: Intentar usar Python primero
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Usando Python...
    python -m http.server 8080
    goto :end
)

:: Si no hay Python, usar npx serve
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Usando npx serve...
    npx serve . -p 8080
    goto :end
)

echo [ERROR] No se encontro Python ni Node.js
echo Por favor instala Python o Node.js

:end
pause