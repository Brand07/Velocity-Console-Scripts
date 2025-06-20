/*
Author: Brandon Yates
Date: 6/20/2025
Purpose: To speed the 402 -> 401 Process
*/




function onScan(event) {
    var text1 = Screen.getText(0,0,18); // "402 Relocate Query"
    var position = Screen.getCursorPosition();
    var row = position.row;
    //View.toast(event.data);

    if (text1 === "402 Relocate Query" && row === 2) {
        View.toast("Script working!");
    }
}

WLEvent.on("Scan", onScan);

