/*
This script applies to a specific screen
in the application that asks for a barcode,
scans the barcode, and then sends a tab key
to move to the next field. There is a slight
delay between the scan and the auto-entered tab
key to allow the application to process the scan
*/

function onScan(scanData) {
    // Process the scan data here
    Device.beep(50, 50, 50);
    // After processing the scan data, wait for 150 milliseconds 
    // before sending the tab character
    setTimeout(function() {
        //View.toast("Sending Tab Key");
        Device.sendKeys('{HEX:0009}');
        //View.toast("Tab Key Sent");
    }, 150);
}

WLEvent.on("Scan", onScan);