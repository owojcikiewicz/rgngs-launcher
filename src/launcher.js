const {ipcRenderer} = require("electron");
const cssButton = document.getElementsByClassName("download-css");
const downloadButton = document.getElementsByClassName("download-addons");
const updateButton = document.getElementsByClassName("update-addons");
const joinButton = document.getElementsByClassName("join-server");

const lol = document.getElementsByClassName("join-server").textContent;

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


// PROGRESS BAR 

function ProgressBarStart(){
    const progressBar = document.getElementsByClassName('progress-bar')[0]

setInterval(() => {
    const computedStyle = getComputedStyle(progressBar)
    const width = parseFloat(computedStyle.getPropertyValue('--width')) || 0

    progressBar.style.setProperty('--width', width + .1)}, 5)
}
