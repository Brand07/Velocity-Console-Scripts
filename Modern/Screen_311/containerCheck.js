/*
- Author: Brandon Yates
- Date: 5/5/2025
- Description: Used to control the logic on the 311 screen.
 */


function onScan(event) {
    if (event.data.startsWith("0000") && event.data.length === 20) {
        setTimeout(function () {
            // Disable auto-enter
            Scanner.scanTerminator("AutoEnter");
            // Send tab key after a short delay
            Device.sendKeys("{return}");
        }, 250)
        // Enable Auto-Enter
    } else {
        event.data = "";
        View.toast("Not a container number");
        Scanner.scanTerminator("NoAuto");
    }
}

WLEvent.on("Scan", onScan);