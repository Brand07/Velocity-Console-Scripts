/*
Purpose: To Prevent bad entry on the 301aPickTagTo screen
Date: 6/10/2026
*/

//Custom Functions for remapping methods

function showMessage(message) {
    View.toast(message);
}

function disableScanner() {
    //Disable the scanner for 1 second
    Scanner.enable(false);
    setTimeout(function (){
        Scanner.enable(true);
    }, 1000);
}

function sendEnter(delay=300) {
    Device.sendKeys(`{pause:${delay}}{return}`)
}

function sendTab(delay=300) {
    Device.sendKeys(`{pause:${delay}}{return}`)
}

function checkContainer(scan_data) {
    if (scan_data.length === 20 && scan_data.startsWith("0000")) {
        return scan_data;
    } else {
        disableScanner();
        scan_data.data = "";
        showMessage("Invalid Scan!");
    }
}

