const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  savePDF: (suggestedName) => ipcRenderer.invoke('save-pdf', suggestedName)
});
