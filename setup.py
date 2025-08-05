#!/usr/bin/env python3
"""
Simple setup and build script for File Sorting System
"""
import os
import sys
import subprocess
import platform
import json

def check_requirements():
    """Check if all requirements are met"""
    print("🔍 Checking requirements...")
    
    # Check Python
    if sys.version_info < (3, 7):
        print("❌ Python 3.7+ is required")
        return False
    print(f"✅ Python {sys.version.split()[0]} found")
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()} found")
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()} found")
        else:
            print("❌ npm not found")
            return False
    except FileNotFoundError:
        print("❌ npm not found")
        return False
    
    return True

def install_dependencies():
    """Install Python and Node.js dependencies"""
    print("\n📦 Installing dependencies...")
    
    # Install Python dependencies
    print("Installing Python packages...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Install Node.js dependencies
    print("Installing Node.js packages...")
    subprocess.check_call(["npm", "install"])
    
    print("✅ Dependencies installed")

def run_development():
    """Run the app in development mode"""
    print("\n🚀 Starting development server...")
    subprocess.run(["npm", "run", "electron-dev"])

def build_for_current_platform():
    """Build for the current platform"""
    print(f"\n🔨 Building for {platform.system()}...")
    
    if platform.system() == "Windows":
        subprocess.check_call(["npm", "run", "build-win"])
        print("✅ Windows build completed!")
        print("📦 Installer: dist/File Sorting System Setup 1.0.0.exe")
    elif platform.system() == "Darwin":
        subprocess.check_call(["npm", "run", "build-mac"])
        print("✅ macOS build completed!")
        print("📦 DMG: dist/File Sorting System-1.0.0.dmg")
    elif platform.system() == "Linux":
        subprocess.check_call(["npm", "run", "build-linux"])
        print("✅ Linux build completed!")
        print("📦 AppImage: dist/File Sorting System-1.0.0.AppImage")

def show_menu():
    """Show interactive menu"""
    print("\n" + "="*50)
    print("🗂️  File Sorting System - Setup & Build")
    print("="*50)
    print("1. Check requirements")
    print("2. Install dependencies")
    print("3. Run development version")
    print("4. Build for current platform")
    print("5. Run web version only")
    print("0. Exit")
    print("="*50)

def main():
    """Main function"""
    while True:
        show_menu()
        choice = input("Choose an option (0-5): ").strip()
        
        try:
            if choice == "0":
                print("👋 Goodbye!")
                break
            elif choice == "1":
                if check_requirements():
                    print("✅ All requirements met!")
                else:
                    print("❌ Some requirements are missing")
            elif choice == "2":
                if check_requirements():
                    install_dependencies()
                else:
                    print("❌ Please install missing requirements first")
            elif choice == "3":
                if check_requirements():
                    run_development()
                else:
                    print("❌ Please install missing requirements first")
            elif choice == "4":
                if check_requirements():
                    build_for_current_platform()
                else:
                    print("❌ Please install missing requirements first")
            elif choice == "5":
                print("\n🌐 Starting web version...")
                print("Open http://127.0.0.1:5000 in your browser")
                subprocess.run([sys.executable, "app.py"])
            else:
                print("❌ Invalid choice")
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except subprocess.CalledProcessError as e:
            print(f"❌ Command failed: {e}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
