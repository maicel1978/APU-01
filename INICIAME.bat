@echo off
:: ============================================================
:: INICIAME.bat — Lanzador oficial para APU-01 (Windows)
:: Ecosistema APU - Preparación Acústica Local
:: ============================================================

title APU-01 — Preparación Acústica

echo.
echo ================================================
echo   APU-01 — Preparación Acústica Local
echo   Ecosistema APU (Privacy-First)
echo ================================================
echo.

:: Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no está instalado.
    echo Por favor instala Node.js desde https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js detectado correctamente.
echo.

:: Verificar si serve está disponible (global o vía npx)
echo [INFO] Iniciando servidor con headers de seguridad (COOP + COEP)...
echo.

:: Crear configuración temporal de headers si no existe
if not exist serve.json (
    echo Creando configuración de servidor con headers COEP/COOP...
    (
        echo {
        echo   "headers": [
        echo     {
        echo       "source": "**/*",
        echo       "headers": [
        echo         { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        echo         { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        echo         { "key": "Cross-Origin-Resource-Policy", "value": "cross-origin" }
        echo       ]
        echo     }
        echo   ]
        echo }
    ) > serve.json
)

:: Iniciar servidor en segundo plano
start "" /B npx serve . -p 8080 -c serve.json --no-request-logging

:: Esperar 2 segundos para que el servidor arranque
timeout /t 2 /nobreak >nul

:: Abrir navegador
echo [INFO] Abriendo navegador en http://localhost:8080
start http://localhost:8080

echo.
echo ================================================
echo   Servidor activo en: http://localhost:8080
echo.
echo   - Los headers COOP/COEP están activos
echo   - Puedes usar ambos modos de conversión
echo   - Cierra esta ventana para detener el servidor
echo ================================================
echo.

:: Mantener la ventana abierta
pause >nul