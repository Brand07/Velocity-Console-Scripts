/*
The purpose of this script is to enforce the user to enter
a WorkZone instead of searching across all zones using
a wildcard character.

Author: Brandon Yates
Date: 9/23/2024
 */

// Define the workzones based upon position on the screen
//var workZoneOne = Screen.getText(4,5,4);
//var workZoneTwo = Screen.getText(5,5,4);
//var workZoneThree = Screen.getText(6,5,4);
//var workZoneFour = Screen.getText(7,5,4);
var workZoneFive = Screen.getText(8,5,4);


View.toast("WorkZone Five: " + workZoneFive);

// Function to check the WorkZone fields on Enter key press
function onEnterKeyPress(event) {
    View.toast("Checking WorkZones");
    // Check if one of the workzones has at least three characters inserted
    if (workZoneFive.length === "") {
        setTimeout(function() {
            View.toast("Sending Enter Key");
            Device.sendKeys("{return}");
            View.toast("Enter Key Sent");
        }, 100);
    } else {
        View.toast("Please enter a WorkZone");
        event.data = "";
    }
}

// Attach the Enter key press event handler
WLEvent.on("OnKey<000D>", onEnterKeyPress);