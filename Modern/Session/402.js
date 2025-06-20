/*
Author: Brandon Yates
Date: 6/20/2025
Purpose: To speed the 402 -> 401 Process
*/


// Get the current screen number
var screenNumber = Screen.getText(0,0,3);
//0,0,3 = 402

// Get the cursor's current position
var position = Screen.getCursorPosition();
var row = position.row;


function onScan(event) {
    var text1 = Screen.getText(0,0,18); // "402 Relocate Query"
    var position = Screen.getCursorPosition();

    if (text1 === "402 Relocate Query" && position.row === 2) {
        View.toast("Script working!")
    }
}

WLEvent.on("Scan", onScan);

