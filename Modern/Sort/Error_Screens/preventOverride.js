/*
Purpose: To prevent users from scanning a value in place of "Y" or "N".
Date: 12/9/2025
Screen: Confirm2190
 */

//Send an 'N' so the default on this screen is "No".
Device.sendKeys("N");

function onScan(event) {
    //Get the screen number and cursor row
    var screenNumber = Screen.getText(3,0,12);
    var position = Screen.getCursorPosition();
    var row = position.row;

    if (event && event.data){
        event.data = "";
        Scanner.scanTerminator("NoAuto");
    }

}

WLEvent.on("Scan", onScan);