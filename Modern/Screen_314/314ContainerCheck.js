
function onScan(event) {
    // Process the scan data
    const data = event.data;
    if (data.startsWith("0000")) {
        View.toast("Container number scanned.");
        setTimeout(function() {
            // Disable auto-enter
            Scanner.scanTerminator("NoAuto");
            // Send tab key after a short delay
            Device.sendKeys("{tab}");
        }, 100);
    } else {
        event.data = "";
        View.toast("Not a container number");
    }
}

WLEvent.on("Scan", onScan);