View.toast("Please scan the container number.");
function onScan(event) {
    // Process the scan data
    const data = event.data;
    if (data.startsWith("0000")) {
        View.toast("Container number scanned.");
        Device.beep(25, 25, 25);
        setTimeout(function() {
            Device.sendKeys("{HEX:0009}");
        }, 100);
    } else {
        event.data = "";
        Device.beep(2000, 1000, 50);
        View.toast("Invalid scan. Please rescan.");
    }
}

WLEvent.on("Scan", onScan);