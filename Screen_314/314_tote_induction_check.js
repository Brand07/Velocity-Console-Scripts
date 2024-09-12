/*
This script is used to validate the tote ID scanned in the tote induction screen.
The script checks if the tote ID starts with "TOT" and sends the Enter key if it does.
If the scan starts with anything other than "TOT", the script displays an error message
and prompts the user to rescan the tote ID.

Note: All Alphabetic and Numeric keys are disabled on this screen. The user can only scan the barcode to input.


Author: Brandon Yates
Date: September 12th, 2024
 */


// Function to handle the scan event
function onScan(event) {
    var tote_field = Screen.getText(6, 0, 8);
    const length = event.data.length;

    // Check if the tote field starts with "0" or does not start with "TOT"
    if (tote_field.startsWith("0") || !tote_field.startsWith("TOT")) {
        event.data = "";
        View.toast("Please scan a valid tote ID.");
        Device.beep(250, 75, 50);
        event.preventDefault();
        event.stopPropagation();
        WLEvent.off("OnKey<000D>", onEnterKey);
    } else {
        // If the input matches "TOT", send the Enter key
        setTimeout(function() {
            Device.sendKeys("{return}");
            WLEvent.on("OnKey<000D>", onEnterKey);
        }, 100);
    }
}
// Disable A-Z (uppercase)
const uppercaseLetters = [
    "0041", "0042", "0043", "0044", "0045", "0046", "0047", "0048", "0049", "004A",
    "004B", "004C", "004D", "004E", "004F", "0050", "0051", "0052", "0053", "0054",
    "0055", "0056", "0057", "0058", "0059", "005A"
];

// Disable a-z (lowercase)
const lowercaseLetters = [
    "0061", "0062", "0063", "0064", "0065", "0066", "0067", "0068", "0069", "006A",
    "006B", "006C", "006D", "006E", "006F", "0070", "0071", "0072", "0073", "0074",
    "0075", "0076", "0077", "0078", "0079", "007A"
];

// Disable 0-9
const numbers = [
    "0030", "0031", "0032", "0033", "0034", "0035", "0036", "0037", "0038", "0039"
];

// Function to disable keys
function disableKeys(keycodes) {
    keycodes.forEach(function(keycode) {
        WLEvent.on(`OnKey<${keycode}>`, function(event) {
            Device.errorBeep(75, 50, 50);
            Device.sendKeys("{HEX:0008}");
            event.eventHandled = true;
        });
    });
}
if (Screen.getText(0, 0, 3) === "314") {
    disableKeys(uppercaseLetters);
    disableKeys(lowercaseLetters);
    disableKeys(numbers);
}

// Attach the scan event handler
WLEvent.on("Scan", onScan);