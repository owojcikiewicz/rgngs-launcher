const {app, ipcMain, dialog, shell, BrowserWindow} = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios").default;

const MOTD_URL = "https://pastebin.com/raw/AJgTaRdq";
const SERVER_IP = "192.0.2.1:27015";
const DOWNLOAD_URLS = {
    "css": "",
    "content": ""
};

function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 750,
        frame: false,
        resizable: false,
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
    wind.setSize(1250, 750);
    wind.center();
    wind.webContents.send("motd-set", text);
};

app.whenReady().then(async _ => {
    let wind = null; 
    let motd = "";

    await axios.get(MOTD_URL)
        .then(res => {
            wind = createWindow();
            if (res.data != "") {
                motd = res.data;
            };
        })
        .catch(err => {
            console.log(`[ERROR] ${err}`);
            wind = createWindow();
        });

    ipcMain.on("motd-init", () => {
        if (!wind || motd == "") return;
        
        setMotd(wind, motd);
    });

    ipcMain.on("button-click", (event, arg) => {
        let basePath = "C:\Program Files (x86)\Steam\steamapps\common\GarrysMod";
        let baseGmodPath = path.join(basePath, "garrysmod");

        switch (arg) {
            case "download-css":  
                if (fs.existsSync(baseGmodPath)) {
                    // @TODO: PROCEED TO DOWNLOAD.
                    return;
                };

                wind.webContents.send("notify", "ERROR:Wybierz folder instalacji Garry's Moda.");
                setTimeout(() => {
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
                }, 3000);
                break;
        
            case "download-addons": 
                if (fs.existsSync(baseGmodPath)) {
                    // @TODO: PROCEED TO DOWNLOAD.
                    return;
                };

                wind.webContents.send("notify", "ERROR:Wybierz folder instalacji Garry's Moda.");
                setTimeout(() => { 
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
                }, 3000)
                break;

            case "update-addons": 
                if (fs.existsSync(baseGmodPath)) {
                    // @TODO: PROCEED TO DOWNLOAD.
                    return;
                };

                wind.webContents.send("notify", "ERROR:Wybierz folder instalacji Garry's Moda.");
                setTimeout(() => { 
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
                }, 3000)
                break;

            case "join-server": 
                shell.openExternal(`steam://connect/${SERVER_IP}`);
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

