# Build script to create standalone executables
import os
import sys
import subprocess
import platform
import shutil

def build_python_executable():
    """Build standalone Python executable using PyInstaller"""
    print("Building standalone Python executable...")
    
    # Install PyInstaller if not available
    try:
        import PyInstaller
    except ImportError:
        print("Installing PyInstaller...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    
    # PyInstaller command
    cmd = [
        "pyinstaller",
        "--onefile",
        "--noconsole" if platform.system() == "Windows" else "--console",
        "--name", "file-sorting-backend",
        "--distpath", "python-dist",
        "--workpath", "build-temp",
        "--specpath", "build-temp",
        "app.py"
    ]
    
    print(f"Running: {' '.join(cmd)}")
    subprocess.check_call(cmd)
    
    print("Python executable built successfully!")
    print(f"Location: python-dist/file-sorting-backend{'.exe' if platform.system() == 'Windows' else ''}")

def build_electron():
    """Build Electron app with bundled Python executable"""
    print("Building Electron app...")
    
    # Update package.json to include Python executable
    import json
    
    with open('package.json', 'r') as f:
        config = json.load(f)
    
    # Add Python executable to files
    if 'build' in config and 'extraResources' in config['build']:
        config['build']['extraResources'] = [
            {
                "from": "python-dist",
                "to": "python",
                "filter": "**/*"
            },
            {
                "from": "static",
                "to": "app/static",
                "filter": "**/*"
            },
            {
                "from": "templates",
                "to": "app/templates", 
                "filter": "**/*"
            }
        ]
    
    with open('package.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    # Build Electron
    subprocess.check_call(["npm", "run", "build-win"])

def main():
    """Main build process"""
    print("=== File Sorting System - Build Process ===")
    
    # Clean previous builds
    if os.path.exists("python-dist"):
        shutil.rmtree("python-dist")
    if os.path.exists("build-temp"):
        shutil.rmtree("build-temp")
    if os.path.exists("dist"):
        shutil.rmtree("dist")
    
    try:
        # Step 1: Build Python executable
        build_python_executable()
        
        # Step 2: Build Electron app
        build_electron()
        
        print("\n✅ Build completed successfully!")
        print("📦 Windows installer: dist/File Sorting System Setup 1.0.0.exe")
        print("📁 Portable version: dist/win-unpacked/")
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Build failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
