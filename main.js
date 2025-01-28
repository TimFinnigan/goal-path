const { app, BrowserWindow, screen } = require("electron");

let win;

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const windowWidth = 250; // Small width
  const windowHeight = 50; // Extremely slim height

  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: 0, // Top-left corner
    y: 0, // Top-left corner
    alwaysOnTop: true,
    frame: false,
    transparent: true, // Transparent by default
    resizable: false,
    backgroundColor: "#00000000", // Fully transparent background
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver");
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
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width, height } = primaryDisplay.workAreaSize;

      const windowWidth = 250;
      const windowHeight = 50;

      win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
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
