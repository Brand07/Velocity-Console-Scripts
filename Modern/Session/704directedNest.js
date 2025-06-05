/*
Author: Brandon Yates
Date: 6/5/2025
Purpose: Controls the logic on the 704 Screen
*/


//“AutoTab” - Sends a tab after a scan.
//“AutoEnter” - Sends an enter after a scan.
//“AutoEnterAndTab” - Sends an enter and then a tab after a scan.
//“AutoTabAndEnter” - Sends a tab and then an enter after a scan.
//“NoAuto” - does not send a tab or an enter after a scan.

function onScan(event) {
    var screenNumber = Screen.getText(0, 0, 3); // Gets the screen number.
    // (0,0,3) should equal "704"

    var screenPosition = Screen.getCursorPosition();
    var row = screenPosition.row;
    var column = screenPosition.column;

    if (screenNumber === "704" && row === 2){
        //Debug Message
        View.toast("704 Script Working"); //Remove from Prod
        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:300}{tab}")
    }
    else if(screenNumber === "704" && row === 3){
        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:300}{tab}")
    }
    else if(screenNumber === "704" && row === 5){
        Scanner.scanTerminator("NoAuto");
        Device.sendKeys("{pause:300}{return}");
    }
}

WLEvent.on("Scan", onScan);




