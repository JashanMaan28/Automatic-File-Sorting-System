const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

// Keep a global reference of the window object
let mainWindow;
let flaskProcess;

// Enable live reload for development
if (process.env.NODE_ENV === 'development') {
  try {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
      hardResetMethod: 'exit'
    });
  } catch (e) {
    console.log('electron-reload not available:', e.message);
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // In development mode, Flask is already running via concurrently
  // In production, we'll start Flask here
  if (process.env.NODE_ENV !== 'development') {
    startFlaskServer();
    
    // Wait a bit for Flask to start before loading the page
    setTimeout(() => {
      loadApp();
    }, 2000);
  } else {
    loadApp();
  }

  function loadApp() {
    // Load the app
    mainWindow.loadURL('http://127.0.0.1:5000');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      
      // Focus on window
      if (process.platform === 'darwin') {
        app.dock.show();
      }
    });
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (flaskProcess && process.env.NODE_ENV !== 'development') {
      flaskProcess.kill();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Development tools
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function startFlaskServer() {
  // In production, we need to use the bundled Python executable
  const isPackaged = app.isPackaged;
  
  if (isPackaged) {
    // Try to use bundled Python executable first
    const bundledPython = path.join(process.resourcesPath, 'python', 'file-sorting-backend.exe');
    
    if (require('fs').existsSync(bundledPython)) {
      console.log('Using bundled Python executable');
      flaskProcess = spawn(bundledPython, [], {
        cwd: path.join(process.resourcesPath, 'app')
      });
    } else {
      // Fallback to system Python
      console.log('Bundled Python not found, trying system Python');
      const possiblePythonPaths = ['python', 'python3', 'py'];
      
      let pythonPath = null;
      for (const pyPath of possiblePythonPaths) {
        try {
          require('child_process').execSync(`${pyPath} --version`, { stdio: 'ignore' });
          pythonPath = pyPath;
          break;
        } catch (e) {
          // Continue to next path
        }
      }
      
      if (!pythonPath) {
        // Show error dialog if Python not found
        const { dialog } = require('electron');
        dialog.showErrorBox(
          'Python Required',
          'This application requires Python to run the backend server.\n\n' +
          'Options:\n' +
          '1. Install Python 3.7+ from https://python.org\n' +
          '2. Use the web version by running "python app.py" in the project folder\n' +
          '3. Download a fully bundled version from the releases page'
        );
        app.quit();
        return;
      }
      
      // Run with system Python
      const appPath = path.join(process.resourcesPath, 'app');
      const scriptPath = path.join(appPath, 'app.py');
      
      console.log('Looking for app.py at:', scriptPath);
      console.log('App directory contents:', require('fs').readdirSync(process.resourcesPath));
      
      if (!require('fs').existsSync(scriptPath)) {
        console.error('app.py not found at:', scriptPath);
        
        // Try alternative locations
        const altPaths = [
          path.join(process.resourcesPath, 'app.py'),
          path.join(__dirname, '..', 'app.py'),
          path.join(process.cwd(), 'app.py')
        ];
        
        let foundPath = null;
        for (const altPath of altPaths) {
          if (require('fs').existsSync(altPath)) {
            foundPath = altPath;
            console.log('Found app.py at alternative location:', altPath);
            break;
          }
        }
        
        if (!foundPath) {
          const { dialog } = require('electron');
          dialog.showErrorBox(
            'Installation Error', 
            `Application files are missing.\n\nExpected location: ${scriptPath}\n\nPlease reinstall the application or run the web version by downloading the source code and running "python app.py"`
          );
          app.quit();
          return;
        }
        
        // Use the found path
        flaskProcess = spawn(pythonPath, [foundPath], {
          cwd: path.dirname(foundPath)
        });
      } else {
        flaskProcess = spawn(pythonPath, [scriptPath], {
          cwd: appPath
        });
      }
    }
  } else {
    // Development mode
    const pythonPath = 'python';
    const scriptPath = path.join(__dirname, '..', 'app.py');
    
    flaskProcess = spawn(pythonPath, [scriptPath], {
      cwd: path.join(__dirname, '..')
    });
  }

  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask Error: ${data}`);
  });

  flaskProcess.on('close', (code) => {
    console.log(`Flask process exited with code ${code}`);
  });
  
  flaskProcess.on('error', (error) => {
    console.error('Failed to start Flask server:', error);
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Server Error',
      `Failed to start the backend server: ${error.message}\n\n` +
      'Try one of these solutions:\n' +
      '1. Install Python 3.7+ from https://python.org\n' +
      '2. Run "python app.py" manually in the project folder\n' +
      '3. Use the web version instead'
    );
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Sorting Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('new-task');
          }
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('open-settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About File Sorting System',
              message: 'Automatic File Sorting System',
              detail: 'Version 1.0.0\nBuilt with Electron and Flask\n\nMade with ❤️ by Jashanpreet Singh'
            });
          }
        },
        {
          label: 'GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/JashanMaan28/Automatic-File-Sorting-System');
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: 'About ' + app.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // Auto updater
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (flaskProcess && process.env.NODE_ENV !== 'development') {
    flaskProcess.kill();
  }
});

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select folder to organize'
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Auto updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
  autoUpdater.quitAndInstall();
});
