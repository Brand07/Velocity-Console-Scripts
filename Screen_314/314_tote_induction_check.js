//View.toast("2nd Script started");

function onScan(event) {
    // See if the input matches "TOT"
    if (event.data.startsWith("TOT")) {
        setTimeout(function() {
            //View.toast("Sending Enter Key");
            Device.sendKeys("{return}");
            //View.toast("Enter Key Sent");
        }, 100);
    } else {
        View.toast("Not a Tote ID");
        event.data = "";
    }
}

// Tote ID field
var tote_field = Screen.getText(6, 0, 8);

// Make sure the tote ID field doesn't contain "0"
function toteCheck(event) {
    // Check that the tote field does not start with "TOT"
    var tote_field = Screen.getText(6, 0, 8);
    if (!(tote_field.substring(0, 3) === 'TOT')) {
        // Add your logic here
        View.toast("Please scan a valid tote ID.");
        Device.beep(2000, 1000, 50);
        event.data = "";

    }
}

WLEvent.on("Scan", onScan);
WLEvent.on("OnKey<000D>", toteCheck);