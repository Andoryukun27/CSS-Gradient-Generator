#!/usr/bin/env python3
"""
Simple HTTP server for CSS Gradient Generator
Run this to serve the application locally and avoid CORS issues
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
    """Custom handler to set proper MIME types and default index.html"""

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        """Set proper MIME types for different file extensions"""
        mimetype = super().guess_type(path)
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'
        return mimetype

    def do_GET(self):
        """Serve index.html when root path is requested"""
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()


def main():
    """Start the development server"""

    # Change to the project directory
    project_dir = Path(__file__).parent
    os.chdir(project_dir)

    print(f"🎨 CSS Gradient Generator Development Server")
    print(f"📁 Serving from: {project_dir}")
    print(f"🌐 Server URL: http://{HOST}:{PORT}")
    print(f"📄 Main page: http://{HOST}:{PORT}/index.html")
    print(f"⏹️  Press Ctrl+C to stop the server\n")

    # Create server
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Server started successfully on port {PORT}")

            # Try to open browser automatically
            try:
                webbrowser.open(f'http://{HOST}:{PORT}/index.html')
                print(f"🚀 Opening browser...")
            except Exception as e:
                print(f"⚠️  Could not open browser automatically: {e}")
                print(f"   Please open http://{HOST}:{PORT}/index.html manually")

            print(f"\n🔄 Server is running... (Ctrl+C to stop)")
            httpd.serve_forever()

    except KeyboardInterrupt:
        print(f"\n⏹️  Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"   Try a different port or stop the existing server")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
# Run the server if this script is executed directly
