/*
Purpose: Controls the logic on the 314 and 315 screens
Date: 8/7/2025
Scope: Session
*/



function displayMessage(message){
    View.toast(message);
}

function sendEnter(delay = 300){
    Device.sendKeys(`{pause:${delay}}{return}`)
}

function sendTab(delay = 300){
    Device.sendKeys(`{pause:${delay}}{TAB}`)
}

d = displayMessage;
e = sendEnter;
t = sendTab;

function onScan(event) {
    var screenNumber = Screen.getText(0, 0, 4); //
    var position = Screen.getCursorPosition();
    var row = position.row;

    if(screenNumber === "314 "){
        //Container number expected
        if(event.data.startsWith("0000") && event.data.length === 20 && row === 3){
            d("Valid Scan");
            t(300);
        }else if(event.data.startsWith("TOT") && row === 6){
            d("Valid Tote ID");
            e(300);
        }else{
            d("Invalid Scan");
            event.data = "";
        }
    }else if(screenNumber === "315 "){
        if(event.data.startsWith("TOT") && row === 3){
            d("Valid Scan");
            e(300);
        }else{
            d("Invalid Scan");
            event.data = "";
        }
    }
}

WLEvent.on("Scan", onScan);