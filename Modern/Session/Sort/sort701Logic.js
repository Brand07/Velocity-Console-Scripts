/*
Purpose: Controls the logic on the 701 Screen
Date: 10/20/2025
Author: Brandon Yates
Screen: @701ContPack
 */

function getDeviceIp(){
    var ip = Network.getWifiAddress && Network.getWifiAddress();
    if (!ip || ip === "0.0.0.0"){
        if (Network.getIPAddress){
            ip = Network.getIPAddress();
        }
    }
    return ip || "Unknown";
}

function sendEnter(delay = 250) {
    if (typeof delay !== "number" || delay < 0) {
        console.log("Invalid delay value");
        return;
    }
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function sendTab(delay = 300){
    if (typeof delay !== "number" || delay < 0){
        console.log("Invalid delay value");
        return;
    }
    Device.sendKeys(`{pause:${delay}}{TAB}`);
}

function showDebugMessage(message) {
    View.toast(message);
}
const d = showDebugMessage; // declared properly

// normalize scan data to a string
function normalizeScan(scanData){
    if (scanData == null) return "";
    if (typeof scanData === "string") return scanData;
    if (typeof scanData === "object"){
        if (typeof scanData.data === "string") return scanData.data;
        if (typeof scanData.value === "string") return scanData.value;
        try { return JSON.stringify(scanData); } catch(e){ return String(scanData); }
    }
    return String(scanData);
}

function onScan(scanData){
    var screenNumber = Screen.getText(0, 0, 4);
    var position = Screen.getCursorPosition();
    var row = position.row;

    var scanString = normalizeScan(scanData);

    if (screenNumber === "701 " && row === 2){
        if (scanString.startsWith("0000") || scanString.startsWith("PLT") || scanString.startsWith("PID")){
            sendTab(300);
            Device.sendKeys("PALS");
            sendTab(300);
        } else {
            Scanner.scanTerminator("NoAuto");
            if (scanData && typeof scanData === "object" && "data" in scanData){
                scanData.data = "";
            }
            d("Invalid Scan!");
            return;
        }
    }
}

WLEvent.on("Scan", onScan);