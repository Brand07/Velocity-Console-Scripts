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
    //View.toast("Screen Number: " + screenNumber);

    // Check if the cursor is in the cont field on screen 314
    if (screenNumber === "314" && position.row === 3) {
        // 0,0,3 = "314"
        if (event.data.startsWith("0000")) {
            setTimeout(function () {
                // Disable auto-enter
                Scanner.scanTerminator("NoAuto");
                // Send tab key after a short delay
                Device.sendKeys("{pause:150}{tab}");
                View.toast("Tab Key Sent");
            }, 100);
        } else {
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
            View.toast("Not a Tote ID");
            event.data = "";
        }
    }
    else if (screenNumber === "301") {
        Device.sendKeys("{return}");
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
/*
if (Screen.getText(0, 0, 3) === "314") {
    disableKeys(uppercaseLetters);
    disableKeys(lowercaseLetters);
    disableKeys(numbers);
}
*/

// Attach the scan event handler
WLEvent.on("Scan", onScan);

