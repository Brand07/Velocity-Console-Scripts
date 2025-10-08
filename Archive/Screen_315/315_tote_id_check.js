/*
Date: August 30th, 2024
Author: Brandon Yates
The purpose of this script is to not only check
for the 'tot' prefix in the scanned barcode, but
also auto-tab to the workzone field.
 */

//View.toast("2nd Script started");

function onScan(event) {
    // See if the input matches "TOT"
    if (event.data.startsWith("TOT")) {
        setTimeout(function() {
            //View.toast("Sending Enter Key");
            Device.sendKeys('{HEX:0009}');
            //View.toast("Enter Key Sent");
        }, 100);
    }
    else {
        View.toast("Not a Tote ID");
        event.data = "";
    }
}

WLEvent.on("Scan", onScan);
