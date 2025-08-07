/*
Purpose: Controls the logic on the 314 and 315 screens
Date: 8/7/2025
Scope: Session
*/



function displayMessage(message){
    View.toast(message);
}

function sendKey(delay = 300, key){
    Device.sendKeys(`{pause:${delay}}{${key}}`)
}

d = displayMessage;
k = sendKey;

function onScan(event) {
    var screenNumber = Screen.getText(0, 0, 4); //
    var position = Screen.getCursorPosition();
    var row = position.row;

    if(screenNumber === "314 "){
        //Container number expected
        if(event.data.startsWith("0000") && row === 3){
            d("Valid Scan");
            k(300, "TAB");
        }else{
            d("Scan the container.");
            event.data = "";
        }
    }
}

WLEvent.on("Scan", onScan);