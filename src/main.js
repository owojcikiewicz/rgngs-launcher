const {app, ipcMain, dialog, BrowserWindow} = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
    const win = new BrowserWindow({
        width: 1250,
        height: 750,
        minWidth: 1250,
        minHeight: 750,
        maxWidth: 1250,
        maxHeight: 750,
        frame: false,
        icon: path.join(__dirname, "../assets", "icon.png"),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });
    
    win.loadFile("index.html");
    win.removeMenu();

    return win;
};

function setMotd(wind, text) {
    wind.webContents.send("motd-set", text);
};

app.whenReady().then(_ => {
    let wind = createWindow();

    ipcMain.on("button-click", (event, arg) => {
        switch (arg) {
            case "download-css": 
                dialog.showOpenDialog({properties: ["openDirectory"]})
                    .then(response => {
                        if (response.canceled) {
                            wind.webContents.send("notify", "ERROR:Nie wybrano foldera.");
                            return;
                        };

                        let selectedPath = response.filePaths[0]; 
                        let targetPath = path.join(selectedPath, "garrysmod");
                        if (!fs.existsSync(targetPath)) {
                            wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                            return;
                        };

                        // @TODO: DOWNLOAD CSS CONTENT.
                    })
                    .catch(console.error);
                break;

            case "download-addons": 
                dialog.showOpenDialog({properties: ["openDirectory"]})
                    .then(response => {
                        if (response.canceled) {
                            wind.webContents.send("notify", "ERROR:Nie wybrano foldera.");
                            return;
                        };

                        let selectedPath = response.filePaths[0]; 
                        let targetPath = path.join(selectedPath, "garrysmod");
                        if (!fs.existsSync(targetPath)) {
                            wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                            return;
                        };

                        // @TODO: DOWNLOAD ADDONS.
                    })
                    .catch(console.error);
                break;

            case "update-addons": 
                dialog.showOpenDialog({properties: ["openDirectory"]})
                    .then(response => {
                        if (response.canceled) {
                            wind.webContents.send("notify", "ERROR:Nie wybrano foldera.");
                            return;
                        };

                        let selectedPath = response.filePaths[0]; 
                        let targetPath = path.join(selectedPath, "garrysmod");
                        if (!fs.existsSync(targetPath)) {
                            wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                            return;
                        };

                        // @TODO: UPDATE ADDONS.
                    })
                    .catch(console.error);
                break;

            case "join-server": 
                // @TODO: CONNECT TO SERVER.
                break;

            default: 
                break;
        };
    });

    ipcMain.on("close", (event, arg) => {
        app.quit();
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

