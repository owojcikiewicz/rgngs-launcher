const {app, BrowserWindow} = require("electron");
const path = require("path");

function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 500,
        maxWidth: 500,
        maxHeight: 500,
        minWidth: 500,
        minHeight: 500,
        icon: path.join(__dirname, "../assets", "icon.png")
    });

    win.loadFile("index.html");
    win.removeMenu();
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    };
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    };
});