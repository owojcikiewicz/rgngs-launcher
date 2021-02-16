const {ipcRenderer} = require("electron");
const cssButton = document.getElementsByClassName("download-css");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementsByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");

ipcRenderer.on("asynchronous-reply", (event, arg) => {
    console.log(arg);
});

ipcRenderer.on("notify", (event, message) => {
    let args = message.split(":");
    macOSNotif({
        title: args[0],
        subtitle: args[1],
        btn1Text: "OK",
        btn2Text: null
    });
});

cssButton[0].addEventListener("click", async () => {    
   ipcRenderer.send("asynchronous-message", "download-css");
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

