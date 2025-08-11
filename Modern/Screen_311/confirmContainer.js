/*
Author - Brandon Yates
Date - 5/6/2025
Revised - 8/11/2025
Description - Runs a check on the scanned container to see if it matches the already captured container.
Screen - 311aClusterPick
 */



const capturedContainer = Screen.getText(8, 6, 20); //Current Container

function onScan(event) {
    // Block default handling of all scans; we will manually allow only valid ones
    if (event.data.startsWith("0000") && event.data.length === 20 && event.data === capturedContainer) {
        setTimeout(function () {
            View.toast("Container Validated!");
            Device.sendKeys("{return}");
        }, 300)
    } else {
        event.data = "";
        Device.beep(500, 500, 500);
        View.toast("Not the correct container.");
        Scanner.scanTerminator("NoAuto");
        return;
    }
}

WLEvent.on("Scan", onScan);