View.toast("Script Working.")

function onScan(event) {
    // Screen validation
    var text1SN = Screen.getText(0, 0, 14);
    var text2SN = Screen.getText(1, 0, 5);
    var text3SN = Screen.getText(6, 1, 5);
 
    if (text1SN === "Serial Capture" && text2SN === "Part:" && text3SN === "SerN:") {
 
        // Normalize symbology type
        var type = event.type.replace(/[_\s]/g, "").toUpperCase();
        View.toast("Symbology: " + type, true);
 
        // Check if it's a QR code
        if (type !== "QRCODE")
            return;
 
        View.toast("Raw Data: " + event.data, true);
 
        // Extract data after SN: and before SKU: or line break
        var snMatch = event.data.match(/SN[:\s]*([A-Za-z0-9\-]+)(?=\s*SKU:|\r|\n|$)/i);
        if (snMatch && snMatch[1]) {
            var serialNumber = snMatch[1].trim();
            event.data = serialNumber;
            View.toast("Serial Number: " + serialNumber, true);
            Logger.debug("Extracted Serial Number: " + serialNumber);
        } else {
            Logger.warn("Could not extract serial number after SN:");
            return;
        }
 
        Logger.debug("Scan - Replace - Script Ending: Event = " + JSON.stringify(event));
    }
}
 
// Register the scan handler
WLEvent.on("Scan", onScan);