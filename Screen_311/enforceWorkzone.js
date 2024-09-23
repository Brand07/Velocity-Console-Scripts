/*
The purpose of this script is to enforce the user to enter
a WorkZone instead of searching across all zones using
a wildcard character.

Author: Brandon Yates
Date: 9/23/2024
 */

// Define the workzones based upon position on the screen
var workZoneOne = Screen.getText(4,5,3);
var workZoneTwo = Screen.getText(5,5,3);
var workZoneThree = Screen.getText(6,5,3);
var workZoneFour = Screen.getText(7,5,3);
var workZoneFive = Screen.getText(8,5,3);

View.toast("WorkZone One: " + workZoneOne);
View.toast("WorkZone Two: " + workZoneTwo);
View.toast("WorkZone Three: " + workZoneThree);
View.toast("WorkZone Four: " + workZoneFour);
View.toast("WorkZone Five: " + workZoneFive);

// Function to check the WorkZone fields on scan
function onScan(event) {
    View.toast("Checking WorkZones");
    //Check if one of the workzones has at least three characters inserted
    if (workZoneOne.length > 3 || workZoneTwo.length > 3 || workZoneThree.length > 3 || workZoneFour.length > 3 || workZoneFive.length > 3) {
        setTimeout(function() {
            View.toast("Sending Enter Key");
            Device.sendKeys("{return}");
            View.toast("Enter Key Sent");
        }, 100);
        setTimeout(function() {
        }, 150);
    }
    else {
        View.toast("Please enter a WorkZone");
        event.data = "";
    }
}

WLEvent.on("Scan", onScan);