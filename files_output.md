// /Users/timfinnigan/Documents/GitHub/goal-path/renderer.js

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "goals.json");

function loadGoals() {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    return [];
}

function saveGoals(goals) {
    fs.writeFileSync(filePath, JSON.stringify(goals, null, 2));
}

// Load existing goals
document.addEventListener("DOMContentLoaded", () => {
    const timeline = document.querySelector(".timeline");
    const goals = loadGoals();

    goals.forEach(goal => {
        const goalDiv = document.createElement("div");
        goalDiv.className = "goal";
        goalDiv.textContent = `🟢 ${goal}`;
        timeline.appendChild(goalDiv);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const newGoal = prompt("Enter your new goal:");
            if (newGoal) {
                goals.unshift(newGoal);
                saveGoals(goals);

                const goalDiv = document.createElement("div");
                goalDiv.className = "goal";
                goalDiv.textContent = `🟢 ${newGoal}`;
                timeline.prepend(goalDiv);
            }
        }
    });
});


---

// /Users/timfinnigan/Documents/GitHub/goal-path/index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Goal Path</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            user-select: none;
        }

        .wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            position: relative;
        }

        .wrapper:active {
            cursor: grabbing;
        }

        .goal-container {
            width: 100%;
            height: 100%;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .goal {
            padding: 8px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 5px;
            color: white;
            border: none;
            outline: none;
            width: 100%; /* ✅ Auto-resizes */
            height: 100%; /* ✅ Auto-resizes */
            resize: none; /* Prevent default resizing */
            font-size: 1em;
            cursor: grab; /* ✅ Allows dragging inside */
        }

        /* ✅ Much Smaller Resize Handle */
        #resize-handle {
            width: 8px;  /* Smaller width */
            height: 8px;  /* Smaller height */
            position: absolute;
            bottom: 2px;  /* Slightly offset */
            right: 2px;   /* Slightly offset */
            cursor: nwse-resize;
            background: transparent;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="wrapper" id="drag-area">
        <div class="goal-container">
            <textarea class="goal" id="goal-input" placeholder="Enter your goal"></textarea>
        </div>
        <div id="resize-handle"></div> <!-- ✅ Smaller Resize Handle -->
    </div>

    <script>
        const { ipcRenderer } = require("electron");

        document.addEventListener("DOMContentLoaded", () => {
            const wrapper = document.getElementById("drag-area");
            const resizeHandle = document.getElementById("resize-handle");
            const goalInput = document.getElementById("goal-input");

            let isDragging = false;
            let isResizing = false;
            let startX, startY, startWidth, startHeight;

            // ✅ Dragging behavior (Click anywhere including inside input field)
            function startDragging(e) {
                if (e.target === resizeHandle) return; // Prevent dragging when resizing
                isDragging = true;
                startX = e.screenX;
                startY = e.screenY;
                wrapper.style.cursor = "grabbing";
            }

            function stopDragging() {
                isDragging = false;
                isResizing = false;
                wrapper.style.cursor = "grab";
            }

            function moveWindow(e) {
                if (isDragging) {
                    ipcRenderer.send("move-window", {
                        deltaX: e.screenX - startX,
                        deltaY: e.screenY - startY
                    });
                    startX = e.screenX;
                    startY = e.screenY;
                }

                if (isResizing) {
                    const newWidth = startWidth + (e.clientX - startX);
                    const newHeight = startHeight + (e.clientY - startY);

                    ipcRenderer.send("resize-window", { width: newWidth, height: newHeight });

                    // ✅ Dynamically resize input field
                    goalInput.style.width = `${newWidth - 20}px`;  // Adjust for padding
                    goalInput.style.height = `${newHeight - 20}px`;
                }
            }

            // ✅ Allow dragging inside the input field
            goalInput.addEventListener("mousedown", startDragging);
            wrapper.addEventListener("mousedown", startDragging);
            document.addEventListener("mousemove", moveWindow);
            document.addEventListener("mouseup", stopDragging);

            // ✅ Resizing behavior (Only bottom-right corner)
            resizeHandle.addEventListener("mousedown", (e) => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                const bounds = ipcRenderer.sendSync("get-window-bounds");
                startWidth = bounds.width;
                startHeight = bounds.height;
            });
        });
    </script>
</body>
</html>


---

// /Users/timfinnigan/Documents/GitHub/goal-path/main.js

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


---
