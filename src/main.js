const {app, ipcMain, BrowserWindow} = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 650,
        minWidth: 500,
        minHeight: 650,
        maxWidth: 500,
        maxWidth: 650,
        icon: path.join(__dirname, "../assets", "icon.png"),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });

    win.loadFile("index.html");
    win.removeMenu();
};

app.whenReady().then(_ => {
    createWindow();
    ipcMain.on("asynchronous-message", (event, arg) => {
        console.log(arg);
        event.reply("asynchronous-reply", arg);
    });
});

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