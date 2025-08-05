const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  
  // Listen for menu events
  onNewTask: (callback) => ipcRenderer.on('new-task', callback),
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Add platform information
contextBridge.exposeInMainWorld('platform', {
  isElectron: true,
  os: process.platform
});
