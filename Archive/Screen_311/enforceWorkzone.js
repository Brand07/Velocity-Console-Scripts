/*
The purpose of this script is to enforce the user to enter
a WorkZone instead of searching across all zones using
a wildcard character.

Author: Brandon Yates
Date: 9/23/2024
 */

function onScanTwo(event) {
    // Retrieve the workZoneFive value dynamically
    var workZoneFive = Screen.getText(8, 6, 3);

    // Check if there's something inserted into the WorkZone field
    //Currently works, but does not clear the invalid scan data.
    if (workZoneFive.trim() === "") {
        setTimeout(function() {
            event.data = "";
            View.toast("Please enter a WorkZone");
            event.preventDefault();
            event.stopPropagation();

        }, 100);
    } else {
        View.toast("Sending Enter Key");
        Device.sendKeys("{return}");
        View.toast("Enter Key Sent");
    }
}

// Attach the Enter key press event handler
WLEvent.on("Scan", onScanTwo);