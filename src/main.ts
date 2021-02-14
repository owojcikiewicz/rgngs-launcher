import {app, BrowserWindow} from "electron";

let window: Electron.BrowserWindow;

function createWindow(): void {
    window = new BrowserWindow({
        width: 500,
        height: 750,
        maxWidth: 500,
        maxHeight: 750,
        minWidth: 500,
        minHeight: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile("index.html")
    window.removeMenu()
};

app.once("ready", createWindow);