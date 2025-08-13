#!/usr/bin/env python3
"""
Smarter HTTP server for CSS Gradient Generator
Serves index.html at root and auto-resolves JS files in /js/
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to fix MIME types and resolve missing JS from /js/"""

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'
        return mimetype

    def do_GET(self):
        # Serve index.html if root
        if self.path == '/':
            self.path = '/index.html'

        # If JS file is missing from root, try /js/
        if self.path.endswith('.js') and not os.path.exists(self.translate_path(self.path)):
            possible_path = '/js' + self.path
            if os.path.exists(self.translate_path(possible_path)):
                self.path = possible_path

        return super().do_GET()


def main():
    project_dir = Path(__file__).parent
    os.chdir(project_dir)

    print(f"🎨 CSS Gradient Generator Development Server")
    print(f"📁 Serving from: {project_dir}")
    print(f"🌐 Server URL: http://{HOST}:{PORT}")
    print(f"📄 Main page: http://{HOST}:{PORT}/index.html")
    print(f"⏹️  Press Ctrl+C to stop the server\n")

    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Server started successfully on port {PORT}")
            try:
                webbrowser.open(f'http://{HOST}:{PORT}/index.html')
                print(f"🚀 Opening browser...")
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")

            print(f"🔄 Server is running... (Ctrl+C to stop)")
            httpd.serve_forever()

    except KeyboardInterrupt:
        print(f"\n⏹️  Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:
            print(f"❌ Port {PORT} is already in use")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()