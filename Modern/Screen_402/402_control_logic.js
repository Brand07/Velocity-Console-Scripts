/*
Author: Brandon Yates
Date: 8/5/2025
Purpose: To speed the 402 -> 401 Process
*/




function onScan(event) {
    var text1 = Screen.getText(0,0,18); // "402 Relocate Query"
    var position = Screen.getCursorPosition();
    var row = position.row;
    //View.toast(event.data);

    setTimeout(function() {
        if (text1 === "402 Relocate Query" && position.row === 2) {
            View.toast("Script working!"); //Remove from Prod
            Device.sendKeys("{return}");
            Device.sendKeys("{F2}");
            Device.sendKeys("401");
            Device.sendKeys("{return}");

        }
    }, 1000);
}

WLEvent.on("Scan", onScan);