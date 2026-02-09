/*
The control all of the pick logic for SDR
Date: 2/9/2026
Screens Covered: 314, 315, 301a, etc.
 */


// ============ Custom Functions ============

//Show toast messages
function showMessage(message) {
    View.tost(message);
}

//Sends an enter after a delay
function sendEnter(delay = 300) {
    Device.Sendkeys(`{pause:${delay}}{return}`);
}

//Sends a tab key after a delay
function sendTab(delay = 300){
    Device.Sendkeys(`{pause:${delay}}{tab}`);
}

function playSound(sound) {
    Device.beepPlayFile(sound);
}

//Disable the scanner for 1 second on an invalid scan
function disableScanner(){
    //Disable the scanner for 1 second
    Scanner.enable(false);
    setTimeout(function (){
        Scanner.enable(true);
    }, 1000);
}

// ============ End Custom Functions ============

