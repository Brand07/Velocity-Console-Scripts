function onScan(event) {
    const length = event.data.length;

    if (length > 9) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode is too long!");
        //Device.playSound("horn.wav");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (length < 8) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode is too short!");
        Scanner.scanTerminator("NoAuto");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (event.data.startsWith("0000")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a container number.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (event.data.startsWith("1923")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a UPC number.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (event.data.startsWith("T")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a Tag number.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (event.data.startsWith("PLT")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a PLT number.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    } else if (event.data.startsWith("PID")) {
        Device.beep(2000, 1000, 50);
        View.toast("That's a PID number.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    }

    // Special character check (should also return if invalid)
    const specialChars = /[!@#$%^&*()_+={}|[\]\\';,.<>/?]/;
    if (specialChars.test(event.data)) {
        Device.beep(2000, 1000, 50);
        View.toast("Barcode contains special characters.");
        event.data = "";
        setTimeout(function() {}, 200);
        return;
    }

    // Only valid scans reach here
    setTimeout(function() {
        Device.sendKeys("{return}");
    }, 200);
}

WLEvent.on("Scan", onScan);