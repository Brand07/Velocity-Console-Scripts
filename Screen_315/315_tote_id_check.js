/*
Date: August 30th, 2024
Author: Brandon Yates
The purpose of this script is to not only check
for the 'tot' prefix in the scanned barcode, but
also auto-tab to the workzone field and auto-enter
'*101 or %101' into the workzone field.
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
        setTimeout(function() {
            //View.toast("Sending Workzone");
            Device.sendKeys('*101');
            //View.toast("Setting Workzone");
        }, 150);
    }
    else {
        View.toast("Not a Tote ID");
        event.data = "";
    }
}

WLEvent.on("Scan", onScan);



