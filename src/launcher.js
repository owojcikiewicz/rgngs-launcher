const {ipcRenderer} = require("electron");
const cssButton = document.getElementsByClassName("download-css");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementsByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");
const closeButton = document.getElementById("close-button");
const motd = document.getElementsByClassName("motd-text-container");
const motdText = document.getElementsByClassName("motd-text-container").textContent;
const progressBarText = document.getElementsByClassName("progress-bar").innerHTML;

ipcRenderer.send("motd-init");

ipcRenderer.on("button-reply", (event, arg) => {
    console.log(arg);
});

ipcRenderer.on("motd-set", (event, arg) => {
    motd[0].textContent = arg;
});

ipcRenderer.on("notify", (event, message) => {
    let args = message.split(":");
    macOSNotif({
        title: args[0],
        subtitle: args[1],
        theme: macOSNotifThemes.Light,
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

function progressBarInit(text, value) {
    let progressBar = document.getElementById("progress");
    progressBar.innerHTML = text;
    progressBar.style.display = "block";
    document.getElementsByClassName("button-main-container")[0].style.height = "calc(35% - 36px)";
    document.getElementsByClassName("download-css")[0].style.padding = "0px 0px 0px 0px";
    document.getElementsByClassName("download-addons")[0].style.padding = "0px 0px 0px 0px";
    document.getElementsByClassName("update-addons")[0].style.padding = "0px 0px 0px 0px";
    document.getElementsByClassName("join-server")[0].style.padding = "0px 0px 0px 0px";
 
    progressBar.style.setProperty("--width", value ? value : 0);

    return progressBar;
};

function progressBarHide() {
    let progressBar = document.getElementById("progress");
    progressBar.style.display = "none";
    document.getElementsByClassName("button-main-container")[0].style.height = "35%";
    document.getElementsByClassName("download-css")[0].style.padding = "5px 5px 5px 5px";
    document.getElementsByClassName("download-addons")[0].style.padding = "5px 5px 5px 5px";
    document.getElementsByClassName("update-addons")[0].style.padding = "5px 5px 5px 5px";
    document.getElementsByClassName("join-server")[0].style.padding = "5px 5px 5px 5px";
};

let bar = null;
ipcRenderer.on("progress-bar", (event, message) => {
    if (!bar) {
        bar = progressBarInit(message[0]);
    };

    bar.style.setProperty("--width", message[1]);
});

ipcRenderer.on("progress-bar-hide", (event, message) => {
    progressBarHide();
});
