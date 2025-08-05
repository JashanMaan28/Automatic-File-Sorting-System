#!/usr/bin/env python3
"""
Development script to run Flask with auto-reload for Electron development
"""
import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.absolute()
sys.path.insert(0, str(project_root))

# Set development environment
os.environ['FLASK_ENV'] = 'development'
os.environ['FLASK_DEBUG'] = '1'

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True,
        use_reloader=True
    )
