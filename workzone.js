/*
The purpose of this script is to prevent users from only using
a wildcard character in the Workzone fields. The user should at least
enter 1 or 2 characters after the wildcard character. If the user
only enters the wildcard character, the script will display an error
message and prompt the user to enter more characters.
*/

View.toast("Script Working.");

function onScan(event) {
    var zoneOne = Screen.getText(4, 6);
    // Check if the input is only a wildcard character
    if (zoneOne === "*") {
        View.toast("Please enter more characters.");
        // Clear the scanned data
        event.data = "";
        return;
    }

    // TODO: Add a delay after the scan event
    // to give the scan time to process the data

    setTimeout(function() {
        if (zoneOne.length <= 1) {
            View.toast("Step 2 working.");
            // If the user only enters the wildcard character, display an error message
            Device.beep(2000, 1000, 50);
            View.toast("Please enter more characters.");
            // Clear the scanned data
            event.data = "";
        }
    }, 1000); // Adjust the delay as needed
}

Screen.on("Scan", onScan);