#!/usr/bin/env python3
"""
serve.py — Servidor HTTP con headers COOP/COEP para el ecosistema APU
Compatible con APU-01, APU-02, APU-03...

Uso:
    python serve.py
    python serve.py 9000

Incluye automáticamente:
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Embedder-Policy: require-corp
"""

import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

PORT = 8080
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"[ERROR] Puerto inválido: {sys.argv[1]}")
        sys.exit(1)

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Servidor multihilo para mejor rendimiento"""
    daemon_threads = True
    allow_reuse_address = True

class APURequestHandler(SimpleHTTPRequestHandler):
    """Manejador que inyecta headers de seguridad del ecosistema APU"""

    def end_headers(self):
        # Headers críticos para SharedArrayBuffer y FFmpeg.wasm
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")

        # Seguridad adicional
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")

        # Caché para assets estáticos
        if self.path.endswith(('.wasm', '.js', '.css')):
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        elif self.path.endswith(('.html', '.json')):
            self.send_header("Cache-Control", "no-cache, must-revalidate")

        super().end_headers()

    def log_message(self, format, *args):
        # Log más limpio
        print(f"[APU] {self.address_string()} - {format % args}")

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("\n" + "=" * 56)
    print("   APU-01 — Servidor de desarrollo con headers COEP/COOP")
    print("   Ecosistema APU (Privacy-First)")
    print("=" * 56)
    print(f"\n🚀 Servidor iniciado en: http://localhost:{PORT}")
    print("   Headers COOP + COEP activos (SharedArrayBuffer habilitado)")
    print("   Presiona Ctrl+C para detener\n")

    try:
        server = ThreadedHTTPServer(("", PORT), APURequestHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n[APU] Servidor detenido por el usuario.")
    except OSError as e:
        if e.errno == 98 or e.errno == 10048:  # Puerto en uso
            print(f"\n[ERROR] El puerto {PORT} ya está en uso.")
            print("Prueba con otro puerto: python serve.py 8081")
        else:
            print(f"\n[ERROR] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()