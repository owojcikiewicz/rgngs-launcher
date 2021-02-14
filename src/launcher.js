const {ipcRenderer} = require("electron");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementsByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");
const lol = document.getElementsByClassName("join-server").textContent;

ipcRenderer.on("asynchronous-reply", (event, arg) => {
    console.log(event);
    console.log(arg);

    joinButton[0].textContent = arg;
});

downloadButton[0].addEventListener("click", async () => {
    ipcRenderer.send("asynchronous-message", "download-addons");
});

updateButton[0].addEventListener("click", async () => {
    ipcRenderer.send("asynchronous-message", "update-addons");
});

joinButton[0].addEventListener("click", async () => {
    ipcRenderer.send("asynchronous-message", "join-server");
});