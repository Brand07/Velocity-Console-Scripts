//View.toast("Script started");
function onScan(scanData) {
    // Process the scan data here
    Device.beep(50, 50, 50);
    // After processing the scan data, wait for 1/10th of a second second (100 milliseconds) before sending the tab character
    setTimeout(function() {
        //View.toast("Sending Tab Key");
        Device.sendKeys('{HEX:0009}');
        //View.toast("Tab Key Sent");
    }, 100);
}

WLEvent.on("Scan", onScan);