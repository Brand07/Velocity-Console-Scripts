/*
Author: Brandon Y
Date: 1/30/2025
Purpose: To prevent a user from overriding a container with a different container number.
Target Screen: "Container_Override"
 */


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
            View.toast("Key Pressed"); //Debugging
            Device.errorBeep(75, 50, 50);
            event.eventHandled = true;
        });
    });
}

if (Screen.getText(0, 10, 7) === "Confirm") { // Working
    View.toast("Container Override Is NOT Allowed.");
    Scanner.enable(false);
    disableKeys(uppercaseLetters);
    disableKeys(lowercaseLetters);
    disableKeys(numbers);
    setTimeout(function() {
        Device.sendKeys("n");
        Device.sendKeys("{return}");
    }, 1000); // 1 second delay
} else {
    View.toast("Are we on the right screen?");
    Scanner.enable(true);
}

