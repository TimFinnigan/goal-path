const { app, BrowserWindow, ipcMain } = require("electron");

let win;

app.whenReady().then(() => {
    if (process.platform === "darwin") {
        app.dock.show();
    }

    win = new BrowserWindow({
        width: 250,
        height: 65,
        x: 0,
        y: 0,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        resizable: true, // ✅ Allow resizing
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

// ✅ Allow renderer to get window size
ipcMain.on("get-window-bounds", (event) => {
    event.returnValue = win.getBounds();
});

// ✅ Resize window dynamically
ipcMain.on("resize-window", (event, { width, height }) => {
    if (win) {
        win.setBounds({
            x: win.getBounds().x,
            y: win.getBounds().y,
            width: Math.max(width, 150), // Minimum width
            height: Math.max(height, 50), // Minimum height
        });
    }
});

// ✅ Handle window dragging
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
