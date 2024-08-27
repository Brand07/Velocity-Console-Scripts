View.toast("Please scan the container number.");
function onScan(scanData) {
    // Process the scan data
    if (scanData.startsWith("0000")) {
        Device.beep(25, 25, 25);
        setTimeout(function() {
            Device.sendKeys("{HEX:0009}");
        }, 100);
    } else {
        Device.beep(2000, 1000, 50);
        View.toast("Invalid scan. Please rescan.");
        scanData = "";
    }
}

WLEvent.on("Scan", onScan);