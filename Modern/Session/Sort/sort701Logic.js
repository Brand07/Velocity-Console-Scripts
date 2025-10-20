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


//Main scan function

function onScan(scanData){
    var screenNumber = Screen.getText(0, 0, 4); //Get the screen number
    var position = Screen.getCursorPosition(); //Get the cursor position
    var row = position.row; //Get the row

    //701 Start
    if (screenNumber === "701" && row === 2){
        //Check for container, PLT, or PID
        if(scanData.startsWith("0000") || scanData.startsWith("PLT") || scanData.startsWith("PID")){
            //Tab down to the 'Cont. Type' field
            sendTab(300);
            //Send "PALS"
            Device.sendKeys("PALS");
            //Tab down to the location field
            sendTab(300);
        }else{
            //Interrupt the auto-tab/enter and clear the scan data
            Scanner.scanTerminator("NoAuto");
            scanData.data = "";
            d("Invalid Scan!");
        }
    }
}

WLEvent.on("Scan", onScan);