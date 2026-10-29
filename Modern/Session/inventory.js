/*
Date: 10/28/2026
Purpose: Controls all of the logic for the 900 series screens for inventory counting.
*/

// Custom functions for remapping methods

function showMessage(message) {
    View.toast(message);
}

function disableScanner() {
    // Disable the scanner for 1 second
    Scanner.enable(false);

    setTimeout(function () {
        Scanner.enable(true);
    }, 1000);
}

function sendEnter(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{return}`);
}

function sendTab(delay = 300) {
    Device.sendKeys(`{pause:${delay}}{tab}`);
}

function onScan(event) {
    var screenNumber = Screen.getText(0, 0, 4);
    var position = Screen.getCursorPosition();
    var row = position.row;

    if (screenNumber === "903 " && row === 2) {
        if (event.data) {
            sendEnter(200);
        } else {
            showMessage("Blank Scan...");
        }
    } 
    else if (screenNumber === "901t" && row === 4) {
        if (event.data) {
            sendEnter(200);
        } else {
            showMessage("Blank Scan...");
        }
    }
}

WLEvent.on("Scan", onScan);