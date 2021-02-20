const {app, ipcMain, dialog, shell, BrowserWindow} = require("electron");
const {download} = require("electron-dl");
const path = require("path");
const fs = require("fs");
const axios = require("axios").default;
const AdmZip = require("adm-zip");

const MOTD_URL = "https://pastebin.com/raw/AJgTaRdq";
const SERVER_IP = "192.0.2.1:27015";
const DOWNLOAD_URLS = {
    "css": "https://github.com/processing/processing/archive/master.zip",
    "content": "https://github.com/processing/processing/archive/master.zip",
    "update": "https://github.com/processing/processing/archive/master.zip"
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

async function downloadItem(wind, item, directory, onStarted, onProgress, onCancel) {
    if (!wind || !DOWNLOAD_URLS[item]) return;

    let url = DOWNLOAD_URLS[item];

    await download(wind, url, {directory: directory, onStarted: onStarted, onProgress: onProgress, onCancel: onCancel});
};

function progressBar(wind, text, value) {
    wind.webContents.send("progress-bar", [text, value]);
};

function progressBarHide(wind) {
    wind.webContents.send("progress-bar-hide");
};

async function unzip(path, location) {
    let zip = new AdmZip(path);

    await zip.extractAllTo(location);
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
        let basePath = "C:\Program Files (x86)\Steam\steamapps\common\GarrysMod\garrysmod";
        let baseGmodPath = path.join(basePath, "addons");

        switch (arg) {
            case "download-css":  
                if (fs.existsSync(baseGmodPath)) {
                    downloadItem(wind, "css", baseGmodPath, 
                        (item) => {
                            progressBar(wind, "POBIERANIE CSS", 1);

                            item.once("done", (event, state) => {
                                if (state == "completed") {
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                    unzip(item.savePath, targetPath);
                                    progressBarHide(wind);
                                    return;
                                };
                            });
                        }, 
                        (progress) => {
                            progressBar(wind, "POBIERANIE CSS", progress.percent * 100);
                        }, 
                        (item) => {
                            progressBarHide(wind);
                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                        }
                    );

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
                            let gmodPath = path.join(selectedPath, "garrysmod");
                            let targetPath = path.join(gmodPath, "addons");
                            if (!fs.existsSync(targetPath)) {
                                wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                                return;
                            };

                            downloadItem(wind, "css", targetPath, 
                                (item) => {
                                    progressBar(wind, "POBIERANIE CSS", 1);
        
                                    item.once("done", (event, state) => {
                                        if (state == "completed") {
                                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                            unzip(item.savePath, targetPath);
                                            progressBarHide(wind);
                                            return;
                                        };
                                    });
                                }, 
                                (progress) => {
                                    progressBar(wind, "POBIERANIE CSS", progress.percent * 100);
                                }, 
                                (item) => {
                                    progressBarHide(wind);
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                                }
                            );
                        })
                        .catch(console.error);
                }, 3000);
                break;
        
            case "download-addons": 
                if (fs.existsSync(baseGmodPath)) {
                    downloadItem(wind, "content", baseGmodPath, 
                        (item) => {
                            progressBar(wind, "POBIERANIE PACZKI", 1);

                            item.once("done", (event, state) => {
                                if (state == "completed") {
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                    unzip(item.savePath, targetPath);
                                    progressBarHide(wind);
                                    return;
                                };
                            });
                        }, 
                        (progress) => {
                            progressBar(wind, "POBIERANIE PACZKI", progress.percent * 100);
                        }, 
                        (item) => {
                            progressBarHide(wind);
                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                        }
                    );
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
                            let gmodPath = path.join(selectedPath, "garrysmod");
                            let targetPath = path.join(gmodPath, "addons");
                            if (!fs.existsSync(targetPath)) {
                                wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                                return;
                            };

                            downloadItem(wind, "content", targetPath, 
                                (item) => {
                                    progressBar(wind, "POBIERANIE PACZKI", 1);
        
                                    item.once("done", (event, state) => {
                                        if (state == "completed") {
                                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                            unzip(item.savePath, targetPath);
                                            progressBarHide(wind);
                                            return;
                                        };
                                    });
                                }, 
                                (progress) => {
                                    progressBar(wind, "POBIERANIE PACZKI", progress.percent * 100);
                                }, 
                                (item) => {
                                    progressBarHide(wind);
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                                }
                            );
                        })
                        .catch(console.error);
                }, 3000)
                break;

            case "update-addons": 
                if (fs.existsSync(baseGmodPath)) {
                    downloadItem(wind, "update", baseGmodPath, 
                        (item) => {
                            progressBar(wind, "AKTUALIZOWANIE PACZKI", 1);

                            item.once("done", (event, state) => {
                                if (state == "completed") {
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                    unzip(item.savePath, targetPath);
                                    progressBarHide(wind);
                                    return;
                                };
                            });
                        }, 
                        (progress) => {
                            progressBar(wind, "AKTUALIZOWANIE PACZKI", progress.percent * 100);
                        }, 
                        (item) => {
                            progressBarHide(wind);
                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                        }
                    );
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
                            let gmodPath = path.join(selectedPath, "garrysmod");
                            let targetPath = path.join(gmodPath, "addons");
                            if (!fs.existsSync(targetPath)) {
                                wind.webContents.send("notify", "ERROR:Nie wykryto gry w wybranym folderze.");
                                return;
                            };

                            downloadItem(wind, "update", targetPath, 
                                (item) => {
                                    progressBar(wind, "AKTUALIZOWANIE PACZKI", 1);

                                    item.once("done", (event, state) => {
                                        if (state == "completed") {
                                            wind.webContents.send("notify", "UWAGA:Pobieranie zostało zakończone.");
                                            unzip(item.savePath, targetPath);
                                            progressBarHide(wind);
                                            return;
                                        };
                                    });
                                }, 
                                (progress) => {
                                    progressBar(wind, "AKTUALIZOWANIE PACZKI", progress.percent * 100);
                                }, 
                                (item) => {
                                    progressBarHide(wind);
                                    wind.webContents.send("notify", "UWAGA:Pobieranie zostało zanulowane.");
                                }
                            );
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

