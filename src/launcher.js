const {ipcRenderer} = require("electron");
const cssButton = document.getElementsByClassName("download-css");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementsByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");
const closeButton = document.getElementById("close-button");
const motdText = document.getElementById("motd-text").textContent;
const motd = document.getElementsByClassName("motd-text-container");
const motdMain = document.getElementsByClassName("motd-main");

ipcRenderer.on("button-reply", (event, arg) => {
    console.log(arg);
});

ipcRenderer.on("motd-set", (event, arg) => {
    motd[0].textContent = arg;
});

ipcRenderer.on("motd-hide", (event, arg) => {
    motdMain[0].style.display = arg == true ? "flex" : "none";
});

ipcRenderer.on("notify", (event, message) => {
    let args = message.split(":");
    macOSNotif({
        title: args[0],
        subtitle: args[1],
        theme: macOSNotifThemes.Dark,
        btn1Text: "OK",
        btn2Text: null,
    });
});

cssButton[0].addEventListener("click", async () => {    
   ipcRenderer.send("button-click", "download-css");
});

downloadButton[0].addEventListener("click", async () => {
    ipcRenderer.send("button-click", "download-addons");
});

updateButton[0].addEventListener("click", async () => {
   ipcRenderer.send("button-click", "update-addons");
});

joinButton[0].addEventListener("click", async () => {
   ipcRenderer.send("button-click", "join-server");
});

closeButton.addEventListener("click", _ => {
    ipcRenderer.send("close", "");
});

