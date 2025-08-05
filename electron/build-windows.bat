@echo off
echo Building Electron app for Windows...

echo Installing Python dependencies...
pip install -r requirements.txt

echo Building with electron-builder...
npm run build-win

echo Build complete! Check the dist folder.
pause
