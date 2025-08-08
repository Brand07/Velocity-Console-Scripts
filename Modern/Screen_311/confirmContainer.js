/*
Author - Brandon Yates
Date - 5-6-2025
Description - Runs a check on the scanned container to see if it matches the already captured container.
Screen - 311aClusterPick
 */



const capturedContainer = Screen.getText(8, 6, 25);

function onScan(event) {
    if (event.data === capturedContainer) {
        setTimeout(function () {
            View.toast("Container Validated!");
            Device.sendKeys("{return}");
        }, 250)
    } else{
        event.data = "";
        View.toast("Not the correct container.");
        Scanner.scanTerminator("NoAuto");
    }
}

WLEvent.on("Scan", onScan);