//View.toast("2nd Script started");

function onScan(event) {
    var tote_field = Screen.getText(6, 0, 8);
    if (!(tote_field.substring(0, 3) === 'TOT')) {
        event.data = "";
        View.toast("Please scan a valid tote ID.");
        Device.beep(250, 75, 50);
    }
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

WLEvent.on("Scan", onScan);
