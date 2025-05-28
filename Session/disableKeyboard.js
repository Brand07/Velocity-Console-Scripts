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

function isBlockedScreen() {
    var screenNumber = Screen.getText(0, 0, 4);
    // Allow typing only on "501 ", block on 501a, 502, and 402
    return screenNumber.trim() === "501a" || screenNumber.trim() === "502" || screenNumber.trim() === "402";
}

function registerGlobalKeyBlockers(keycodes) {
    keycodes.forEach(function(keycode) {
        WLEvent.on(`OnKey<${keycode}>`, function(event) {
            if (isBlockedScreen()) {
                Device.errorBeep(75, 50, 50);
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


