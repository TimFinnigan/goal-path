const { app, BrowserWindow, screen } = require("electron");

let win;

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  win = new BrowserWindow({
    width: 300,
    height: height, // Full height of the screen
    x: 0, // Pin to the left side
    y: 0, 
    alwaysOnTop: true, 
    frame: false, 
    transparent: true,
    resizable: false,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }); // Stays on all virtual desktops
  win.setAlwaysOnTop(true, "screen-saver"); // Ensures it stays above other windows
  win.loadFile("index.html");

  // REMOVE DevTools entirely
  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
  });
});

// Quit app when all windows are closed (except macOS behavior)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// macOS: Recreate window when clicking the dock icon
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.whenReady().then(() => {
      win = new BrowserWindow({
        width: 300,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        x: 0,
        y: 0,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        resizable: false,
        backgroundColor: "#00000000",
        webPreferences: {
          nodeIntegration: true,
        },
      });

      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      win.setAlwaysOnTop(true, "screen-saver");
      win.loadFile("index.html");
    });
  }
});
