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

function toteCheck(event) {
    var tote_field = Screen.getText(6, 0, 8);
    if (tote_field.startsWith("0") || !tote_field.startsWith("TOT")) {
        View.toast("Please scan a valid tote ID.");
        Device.beep(250, 75, 50);
        Prompt.promptOptions("Tote ID Is Invalid", "Please scan a valid Tote ID", "OK|CLOSE", function (result) {
            if (result === "OK") {
                event.data = "";
            } else {
                Device.sendkeys("{F3}");
            }
        })
    }
}


WLEvent.on("Scan", onScan);
WLEvent.on("OnKey<000D>", toteCheck);