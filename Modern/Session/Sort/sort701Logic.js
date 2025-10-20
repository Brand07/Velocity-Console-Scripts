/*
Purpose: Controls the logic on the 701 Screen
Date: 10/20/2025
Author: Brandon Yates
 */

//Function to get the IP of the device
function getDeviceIp(){
    var ip = Network.getWifiAddress();
    if (!ip || ip === "0.0.0.0"){
        //Try alternative method
        if (Network.getIPAddress){
            ip = Network.getIPAddress();
        }
    }
    return ip;
}

function sendEnter(delay = 250) {

    if (typeof delay !== "number" || delay < 0) {
        console.log("Invalid delay value");
    }
    Device.sendKeys(`{pause:${delay}}{return}`);
}


function sendTab(delay = 300){
    if (typeof delay !== "number" || delay < 0){
        console.log("Invalid delay value");
    }
    Device.sendKeys(`{pause:${delay}}{TAB}`);
}

function showDebugMessage(message) {
    View.toast(message);
}

d = showDebugMessage;

