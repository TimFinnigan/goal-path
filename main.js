const { app, BrowserWindow, ipcMain } = require("electron");

let win;

app.whenReady().then(() => {
    // Show default Dock icon (only for macOS)
    if (process.platform === "darwin") {
        app.dock.show();
    }

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
            contextIsolation: false, // Required for IPC to work
        },
    });

    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setAlwaysOnTop(true, "screen-saver");
    win.loadFile("index.html");

    // Ensure window can receive mouse events
    win.setIgnoreMouseEvents(false);

    // Fix possible focus issues on macOS
    win.on("blur", () => {
        win.setIgnoreMouseEvents(false);
    });

    win.on("focus", () => {
        win.setIgnoreMouseEvents(false);
    });
});

// Handle dragging from the renderer process
ipcMain.on("move-window", (event, { deltaX, deltaY }) => {
    if (win) {
        const bounds = win.getBounds();
        win.setBounds({
            x: bounds.x + deltaX,
            y: bounds.y + deltaY,
            width: bounds.width,
            height: bounds.height
        });
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

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
                    contextIsolation: false,
                },
            });

            win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
            win.setAlwaysOnTop(true, "screen-saver");
            win.loadFile("index.html");
            win.setIgnoreMouseEvents(false);
        });
    }
});
