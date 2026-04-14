"""Python desktop launcher for Monopoly Family Edition.

This wraps the existing web game inside a native window powered by pywebview.
"""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

import webview

ROOT = Path(__file__).resolve().parent.parent
HOST = "127.0.0.1"
PORT = 8765


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def start_static_server() -> ThreadingHTTPServer:
    handler = lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs)
    httpd = ThreadingHTTPServer((HOST, PORT), handler)
    thread = Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


def main() -> None:
    httpd = start_static_server()
    webview.create_window(
        "Monopoly Family Edition",
        f"http://{HOST}:{PORT}/index.html",
        width=1450,
        height=940,
        min_size=(1120, 720),
    )
    webview.start(private_mode=False)
    httpd.shutdown()


if __name__ == "__main__":
    main()
