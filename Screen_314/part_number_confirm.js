/*
This script applies to a screen that asks the user to
confirm the part number of a product. The part number
is a string of numbers and letters that is generally
8 characters long.

The part number the user is looking for is displayed
at the top of the screen. The user is supposed to scan
the barcode containing the part number and confirm that
it matches the displayed part number.

The script checks if the scanned part number matches the
displayed part number. If the part number matches, the
script allows the user to proceed to the next screen.
If the part number does not match, the script displays
an error message and prompts the user to rescan the
barcode.

8/15/2024
*/

// location of the part number displayed on the screen
var requiredPartNumber = Screen.getText(3, 6, 8);
View.toast(requiredPartNumber);


function onScan(event) {
    // Check if the scanned part number matches the required part number
    if (event.data === requiredPartNumber) {
        // If the part number matches, proceed to the next screen
        Device.beep(50, 50, 50);
        View.toast("Part number confirmed!");
        // Proceed to the next screen
    } else {
        // If the part number does not match, display an error message
        Device.beep(2000, 1000, 50);
        View.toast("Part number does not match. Please rescan.");
        // Clear the scanned data
        event.data = "";
    }
}

// Register the onScan function to handle scan events
WLEvent.on("Scan", onScan);