/*
This script is used to validate the tote ID scanned in the tote induction screen.
The script checks if the tote ID starts with "TOT" and sends the Enter key if it does.
If the scan starts with anything other than "TOT", the script displays an error message
and prompts the user to rescan the tote ID.

Note: All Alphabetic and Numeric keys are disabled on this screen. The user can only scan the barcode to input.


Author: Brandon Yates
Date: September 12th, 2024
 */


function onScan(event) {
    // See if the input matches "TOT"
    if (event.data.startsWith("TOT")) {
        setTimeout(function() {
            //View.toast("Sending Enter Key");
            Device.sendKeys("{return}");
            //View.toast("Enter Key Sent");
        }, 100);
        setTimeout(function() {
            //View.toast("Sending Workzone");
            //Device.sendKeys('*');
            //View.toast("Setting Workzone");
        }, 150);
    }
    else {
        View.toast("Not a Tote ID");
        event.data = "";
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
            Prompt.promptOptions("Alert", "You are not allowed to type in the Tote ID field.", "OK|CLOSE", function(result) {
                if (result === "OK") {
                    Device.errorBeep(25, 25,20);
                }
            });
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

