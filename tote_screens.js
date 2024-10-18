/*
The purpose of this script is to solidify the differences
between Screen 314 and Screen 315.

This script will check for the current screen it's on and determine what
logical checks should be made to ensure the process stays on track and runs
smoothly.

Author: Brandon Yates
Date: 10/18/2024
 */

/*
Function to check what screen we're currently on.
If 314, some logic will apply, if 315, other logic will apply.
 */

function onScan(event) {
    // Retrieve the screen number
    var screenNumber = Screen.getText(0, 0, 3);
    var position = Screen.getCursorPosition();
    View.toast("Screen Number: " + screenNumber);

    // Check if the cursor is in the cont field on screen 314
    if (screenNumber === "314" && position.row === 3) {
        //0,0,3 = "314"
        if (event.data.startsWith("0000")) {
            setTimeout(function () {
                //View.toast("Sending Enter Key");
                Device.sendKeys("{tab}");
                //View.toast("Enter Key Sent");
            }, 100);
        }
        else {
            View.toast("Not a Container Number");
            event.data = "";
        }
    }
    // Check if we're on screen 314 in the tote id input field
    else if (screenNumber === "314" && position.row === 6) {
        //0,0,3 = "315"
        if (event.data.startsWith("TOT")) {
            setTimeout(function () {
                //View.toast("Sending Enter Key");
                Device.sendKeys("{return}");
                //View.toast("Enter Key Sent");
            }, 100);
        }
        else {
            View.toast("Not a Tote ID");
            event.data = "";
        }
    }
    else if (screenNumber === "315" && position.row === 3) {
        //0,0,3 = "315"
        if (event.data.startsWith("TOT")) {
            setTimeout(function () {
                //View.toast("Sending Enter Key");
                Device.sendKeys("{tab}");
                Device.sendKeys("{return}");
                //View.toast("Enter Key Sent");
            }, 100);
        }
        else {
            View.toast("Not a damn Tote ID");
            event.data = "";
        }
    }
}

// Attach the scan event handler
WLEvent.on("Scan", onScan);

