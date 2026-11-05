"""Запуск локального HTTP-сервера для лабораторной работы №10.

PyCharm: правый клик по файлу -> Run 'run_server'.
Откроется браузер на http://localhost:8000
"""
import http.server
import socketserver
import webbrowser
from pathlib import Path

PORT = 8000
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    # Для .js отдаём корректный MIME-тип (нужен для ES-модулей)
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
    }


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"Сервер запущен: {url}  (остановка: Ctrl+C / красный квадрат в PyCharm)")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен.")
