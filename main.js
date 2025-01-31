const { app, BrowserWindow, screen } = require("electron");

let win;

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

    // Allow normal mouse interactions with elements (Fix for transparent windows)
    win.setIgnoreMouseEvents(false, { forward: true });

    if (!app.isPackaged) {
        win.webContents.on("devtools-opened", () => {
            win.webContents.closeDevTools();
        });
    } else {
        win.webContents.closeDevTools();
    }
});

// Close app when all windows are closed (except macOS)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Recreate window on macOS when clicked
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        app.whenReady().then(() => {
            win = new BrowserWindow({
                width: 250,
                height: 50,
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

            win.setIgnoreMouseEvents(false, { forward: true });
        });
    }
});
