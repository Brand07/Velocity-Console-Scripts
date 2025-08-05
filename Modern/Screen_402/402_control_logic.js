/*
Author: Brandon Yates
Date: 8/5/2025
Purpose: To speed the 402 -> 401 Process
*/




function onScan(event) {
    var text1 = Screen.getText(0,0,18); //
    var text2 = Screen.getText(); // 
    var position = Screen.getCursorPosition();
    var row = position.row;
    View.toast(event.data);

    setTimeout(function() {
        if (text1 === "402 Relocate Query" && row === 2) {
            View.toast("Script working!"); //Remove from Prod
            if (event.data.startsWith("T")) {
                View.toast("Scan Validated"); // Remove from Prod
                Device.sendKeys("{return}");
            } else if (event.data.startsWith("0000") && row === 3) {
                View.toast("Container scanned."); // Remove from Prod
                Device.sendKeys("{return}");
            } else {
                event.data = "";
                View.toast("Invalid Scan.");
            }
        }
    }, 1000);
}

WLEvent.on("Scan", onScan);