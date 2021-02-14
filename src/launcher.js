const {ipcRenderer} = require("electron");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");

downloadButton.addEventListener("click", async _ => {
    console.log("????");
    ipcRenderer.sendSync("download-addons");
});

updateButton.addEventListener("click", _ => {
    ipcRenderer.sendSync("update-addons");
});

joinButton.addEventListener("click", _ => {
    ipcRenderer.sendSync("join-server");
});

ipcRenderer.on("synchronous-reply", (event, arg) => {
    console.log(event);
    console.log(arg);
});