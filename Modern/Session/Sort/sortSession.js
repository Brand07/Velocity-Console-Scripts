/*
Purpose: Controls all the logic for the Sort related screens.
Date: 8/15/2025
*/

function playSound(sound){
    Device.beepPlayFile(sound);
}

function sendEnter(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function sendTab(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{TAB}`);
}

// Function to check the container number
function checkContainer(scan_data) {
    if (scan_data.length === 20 && scan_data.startsWith("0000")) {
        return scan_data;
    } else {
        playSound("not_correct_container.mp3");
        return;
    }
}


function onScan(event){
    var screenNumber = Screen.getText(0, 0, 4); // Get the screen number
    var position = Screen.getCursorPosition(); // Get the cursor position
    var row = position.row; // Get the current row

    if(screenNumber === "704 " && row === 3){
        var containerNumber = checkContainer(event.data);
        if(containerNumber){
            sendTab(300);
        }
    }else if(screenNumber === "704 " && row === 5){
        if(event.data.startsWith("PID" || "PLT")){
            //Tab down to the 'Type' field.
            sendTab(300);
            Device.sendKeys("PALS");
            sendEnter(300);
            return;
        }else{
            //Clear the scan data
            event.data = "";
            Scanner.scanTerminator("NoAuto");
            View.toast("Invalid PID/PLT.");
            playSound("invalid_pid.mp3");
            return;
        }
    }
}

WLEvent.on("Scan", onScan);