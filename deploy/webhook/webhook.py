#!/usr/bin/env python3
"""Minimal GitHub webhook listener for auto-deploy on push to main."""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

SECRET = os.environ.get("WEBHOOK_SECRET", "").encode()
BRANCH = os.environ.get("WEBHOOK_BRANCH", "main")
DEPLOY_SCRIPT = os.environ.get(
    "DEPLOY_SCRIPT",
    os.path.join(os.path.dirname(__file__), "deploy.sh"),
)
HOST = os.environ.get("WEBHOOK_HOST", "127.0.0.1")
PORT = int(os.environ.get("WEBHOOK_PORT", "9001"))


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        sig = self.headers.get("X-Hub-Signature-256", "")

        if SECRET:
            expected = "sha256=" + hmac.new(SECRET, body, hashlib.sha256).hexdigest()
            if not hmac.compare_digest(sig, expected):
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"invalid signature")
                return

        try:
            payload = json.loads(body.decode() or "{}")
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            return

        ref = payload.get("ref", "")
        if ref and ref != f"refs/heads/{BRANCH}":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"ignored")
            return

        subprocess.Popen(["bash", DEPLOY_SCRIPT])
        self.send_response(202)
        self.end_headers()
        self.wfile.write(b"deploy started")

    def log_message(self, fmt, *args):
        print(f"[webhook] {self.address_string()} - {fmt % args}")


if __name__ == "__main__":
    print(f"[webhook] listening on {HOST}:{PORT}")
    HTTPServer((HOST, PORT), Handler).serve_forever()
