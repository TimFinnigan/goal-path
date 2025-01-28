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

  // Enable visibility on all workspaces
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver");

  // Load the app's main HTML file
  win.loadFile("index.html");

  // Remove DevTools in production
  if (!app.isPackaged) {
    win.webContents.on("devtools-opened", () => {
      win.webContents.closeDevTools();
    });
  } else {
    win.webContents.closeDevTools();
  }
});

// Quit the app when all windows are closed (except for macOS behavior)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// macOS: Recreate a window when the dock icon is clicked
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
