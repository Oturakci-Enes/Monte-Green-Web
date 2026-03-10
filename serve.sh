#!/bin/bash
cd "$(dirname "$0")"
/usr/bin/python3 -c "
import http.server, socketserver, os
os.chdir('$(pwd)')
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(('', 8080), handler) as httpd:
    print('Serving on port 8080')
    httpd.serve_forever()
"
