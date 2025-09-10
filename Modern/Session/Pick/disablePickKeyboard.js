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

/*
Disabled on the following screens:
-Confirm container screen.
-Part Number capture screen.
-Serial capture screen.
 */
const screenNumbers = ["311a","311 ", "Seri"];

function isBlockedScreen() {
    var screenNumber = Screen.getText(0, 0, 4);
    // Disable keyboard on various pick department screens/fields
    //return screenNumber.trim() === "311a";
    //Check if the screen is in the list of blocked screens
    return screenNumbers.includes(screenNumber.trim());
}

function registerGlobalKeyBlockers(keycodes) {
    keycodes.forEach(function(keycode) {
        WLEvent.on(`OnKey<${keycode}>`, function(event) {
            if (isBlockedScreen()) {
                Device.beepPlayFile("keyboard_disabled.mp3");
                Prompt.promptOptions("Alert", "You are not allowed to type on this screen.", "OK|CLOSE", function(result) {
                    if (result === "OK") {
                        Device.errorBeep(25, 25, 20);
                    }
                });
                Device.sendKeys("{HEX:0008}");
                event.eventHandled = true;
            }
        });
    });
}

registerGlobalKeyBlockers(uppercaseLetters);
registerGlobalKeyBlockers(lowercaseLetters);
registerGlobalKeyBlockers(numbers);


