const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    title: 'Stiletto Invoice Generator',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');

  // Keep the window title fixed even though the page retitles itself
  // (the page uses document.title to name PDFs saved via window.print()).
  win.on('page-title-updated', (e) => e.preventDefault());

  // Open any external links in the system browser, not in the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

// Save the current page as a PDF. The page's @media print CSS hides the
// app chrome, so only the invoice itself ends up in the file.
ipcMain.handle('save-pdf', async (event, suggestedName) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const safeName = String(suggestedName || 'invoice').replace(/[\\/:*?"<>|]/g, '-');

  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Save Invoice as PDF',
    defaultPath: path.join(app.getPath('documents'), safeName + '.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (canceled || !filePath) return { saved: false };

  try {
    const data = await event.sender.printToPDF({
      printBackground: true,
      pageSize: 'Letter'
    });
    fs.writeFileSync(filePath, data);
    shell.showItemInFolder(filePath);
    return { saved: true, filePath };
  } catch (err) {
    dialog.showErrorBox('Could not save PDF', err.message);
    return { saved: false, error: err.message };
  }
});

app.whenReady().then(() => {
  const isMac = process.platform === 'darwin';
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' }
  ]));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
