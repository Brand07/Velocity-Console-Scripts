/*
- Author: Brandon Yates
- Date: 5/5/2025
- Description: Used to control the logic on the 311 screen.
 */

var screenNumber = Screen.getText(0, 0, 3);
var position = Screen.getCursorPosition();

function onScan(event){
    if (event.data === "") {
        View.toast("Please scan the container number.");
        Scanner.scanTerminator("NoAuto");
        return;
    } else if(event.data.startsWith("0000") && event.data.length === 20 && screenNumber === "311" && position.row === 10) {
        // Disable auto-enter
        Scanner.scanTerminator("AutoEnter");
        // Send tab key after a short delay
        Device.sendKeys("{return}");
    }
}

WLEvent.on("Scan", onScan);